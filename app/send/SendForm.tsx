'use client';

import { Button } from '@/app/components/ui/button';
import { Field } from '@/app/components/ui/field';
import { SendFormSchema, type SendFormSchemaType } from '@/app/send/schemas';
import { HStack, Input, InputAddon, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';

const exchangeRate = 3405; // get from Bitcart API

const SendFundsForm = () => {
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

  const onSubmit = handleSubmit(data => {
    console.log(data);
  });

  const onUSDChange = () => {
    const usdAmount = getValues('usdAmount');
    const ethValue = usdAmount / exchangeRate;
    setValue('ethAmount', ethValue);
  };

  const onETHChange = () => {
    const ethAmount = getValues('ethAmount');
    const usdValue = ethAmount * exchangeRate;
    setValue('usdAmount', usdValue);
  };

  const onMaxClick = () => {
    if (balance.data) {
      const formattedBalance = formatEther(balance.data.value);
      setValue('ethAmount', Number(formattedBalance));
      setValue('usdAmount', Number(formattedBalance) * exchangeRate);
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <Field
        label="Destination Address"
        invalid
        errorText={errors.address?.message?.toString()}
      >
        <Input placeholder="0x0" {...register('address')} />
      </Field>

      <Field
        label="Amount to Send"
        invalid
        errorText={errors.ethAmount?.message?.toString()}
        my={2}
      >
        <VStack>
          <HStack w="100%">
            <InputAddon>USD</InputAddon>
            <Input
              placeholder="0"
              type="number"
              {...register('usdAmount')}
              onBlur={onUSDChange}
            />
          </HStack>
          <HStack w="100%">
            <InputAddon>ETH</InputAddon>
            <Input
              placeholder="0"
              {...register('ethAmount')}
              type="number"
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
