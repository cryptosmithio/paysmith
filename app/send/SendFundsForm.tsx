'use client';

import { Button } from '@/app/components/ui/button';
import { Field } from '@/app/components/ui/field';
import { SendFormSchema, type SendFormSchemaType } from '@/app/send/common';
import { ServerFormStatus, type ServerFormStateType } from '@/lib/formUtil';
import { getEthRate } from '@/lib/server/bcUtil';
import { HStack, Input, InputAddon, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { sendFundsAction } from './actions';

const SendFundsForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [serverState, formAction] = useActionState(sendFundsAction, {
    message: '',
    fields: {},
    errors: {},
    status: ServerFormStatus.INITIAL,
  } as ServerFormStateType);
  const { address } = useAccount();
  const balance = useBalance({ address });

  const maxEthAmount = balance.data
    ? Number(formatEther(balance.data?.value))
    : 0;

  const schemaEthAmount = SendFormSchema.extend({
    ethAmount: SendFormSchema.shape.ethAmount.max(
      maxEthAmount,
      'Insufficient balance'
    ),
  });
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<SendFormSchemaType>({
    resolver: zodResolver(schemaEthAmount),
  });

  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    async function fetchExchangeRate() {
      const rate = await getEthRate();
      setExchangeRate(rate);
    }

    fetchExchangeRate();
  }, []);

  const onUSDChange = () => {
    const usdAmount = getValues('usdAmount');
    const ethValue = usdAmount / exchangeRate;
    setValue('ethAmount', ethValue, { shouldValidate: true });
  };

  const onETHChange = () => {
    const ethAmount = getValues('ethAmount');
    const usdValue = ethAmount * exchangeRate;
    setValue('usdAmount', usdValue, { shouldValidate: true });
  };

  const onSubmit = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      startTransition(() => formAction(formData));
    }
  };

  const onMaxClick = () => {
    if (balance.data) {
      const formattedBalance = formatEther(balance.data.value);
      setValue('ethAmount', Number(formattedBalance), { shouldValidate: true });
      setValue('usdAmount', Number(formattedBalance) * exchangeRate, {
        shouldValidate: true,
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)} //allows client side validation
      ref={formRef}
    >
      <Field
        label="Destination Address"
        invalid
        errorText={
          errors.address?.message?.toString() ||
          serverState.errors.address?.toString()
        }
      >
        <Input placeholder="0x0" {...register('address')} />
      </Field>

      <Field
        label="Amount to Send"
        invalid
        errorText={
          errors.ethAmount?.message?.toString() ||
          serverState.errors.ethAmount?.toString()
        }
        my={2}
      >
        <VStack>
          <HStack w="100%">
            <InputAddon>USD</InputAddon>
            <Input
              placeholder="0"
              {...register('usdAmount')}
              onBlur={onUSDChange}
            />
          </HStack>
          <HStack w="100%">
            <InputAddon>ETH</InputAddon>
            <Input
              placeholder="0"
              {...register('ethAmount')}
              onBlur={onETHChange}
            />
            <Button onClick={onMaxClick}>Max</Button>
          </HStack>
        </VStack>
      </Field>
      <Button type="submit" mt={2}>
        Send
      </Button>
    </form>
  );
};

export default SendFundsForm;
