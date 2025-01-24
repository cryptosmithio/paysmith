'use client';
import { Button } from '@/app/components/ui/button';
import { Field } from '@/app/components/ui/field';
import { CurrencyType } from '@/lib/constants';
import type { ServerFormStateType } from '@/lib/formUtil';
import {
  createListCollection,
  HStack,
  Input,
  InputAddon,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuShare } from 'react-icons/lu';
import { useAccount, useEnsName } from 'wagmi';
import { requestFundsAction } from './actions';
import { LinkExpiryOptions, TrustPeriodOptions } from './constants';
import {
  RequestFundsFormSchema,
  type RequestFundsFormSchemaType,
} from './schemas';

const RequestFundsForm = () => {
  const { address } = useAccount();

  const formRef = useRef<HTMLFormElement>(null);
  const [serverState, formAction, isPending] = useActionState(
    requestFundsAction,
    {
      message: '',
      fields: {},
      errors: {},
      success: false,
    } as ServerFormStateType
  );
  const {
    register,
    getValues,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<RequestFundsFormSchemaType>({
    resolver: zodResolver(RequestFundsFormSchema),
    defaultValues: {
      linkExpirySelect: ['60'],
      trustPeriodSelect: ['24'],
      trustPeriod: '24',
      linkExpiry: '60',
      usdAmount: 0,
      amount: 0,
      paymentAddress: address,
      currency: CurrencyType.ETH,
    },
    progressive: true,
  });
  const exchangeRate = 3405; // get from Bitcart API
  const onUSDChange = () => {
    const usdAmount = getValues('usdAmount');
    const ethValue = usdAmount / exchangeRate;
    setValue('amount', ethValue, { shouldValidate: true });
  };

  const onETHChange = () => {
    const amount = getValues('amount');
    const usdValue = amount * exchangeRate;
    setValue('usdAmount', usdValue, { shouldValidate: true });
  };

  const onSubmit = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      startTransition(async () => {
        formAction(formData);
        console.log('Form submitted');
      });
    }
  };

  const linkExpiryList = createListCollection(LinkExpiryOptions);
  const trustPeriodList = createListCollection(TrustPeriodOptions);

  const { data: ensName } = useEnsName({ address });
  if (ensName) {
    setValue('paymentName', ensName);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)} //allows client side validation
      ref={formRef}
    >
      <Field
        label="Recipient Address"
        errorText={
          errors.paymentAddress?.message?.toString() ||
          serverState.errors.paymentAddress?.toString()
        }
      >
        <Input {...register('paymentAddress')} readOnly />
      </Field>
      <Field
        label="Recipient Name"
        mt={2}
        errorText={
          errors.paymentName?.message?.toString() ||
          serverState.errors.paymentName?.toString()
        }
      >
        <Input {...register('paymentName')} />
      </Field>
      <Field
        label="Amount"
        invalid
        mt={2}
        errorText={
          errors.amount?.message?.toString() ||
          serverState.errors.amount?.toString()
        }
      >
        <VStack>
          <HStack w="100%">
            <InputAddon>ETH</InputAddon>
            <Input
              placeholder="0"
              {...register('amount')}
              onBlur={onETHChange}
            />
          </HStack>
          <HStack w="100%">
            <InputAddon>USD</InputAddon>
            <Input
              placeholder="0"
              {...register('usdAmount')}
              onBlur={onUSDChange}
            />
          </HStack>
        </VStack>
      </Field>
      <Field
        label="Notes"
        mt={2}
        errorText={
          errors.notes?.message?.toString() ||
          serverState.errors.notes?.toString()
        }
      >
        <Textarea {...register('notes')} />
      </Field>
      <Field
        label="Trust Period"
        errorText={
          errors.trustPeriodSelect?.message?.toString() ||
          serverState.errors.trustPeriod?.toString()
        }
        my={2}
      >
        <Controller
          control={control}
          name="trustPeriodSelect"
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={field.value}
              onValueChange={({ value }) => {
                setValue(
                  'trustPeriod',
                  value[0] as '1' | '8' | '24' | '48' | '72' | 'NONE'
                );
                field.onChange(value);
              }}
              onInteractOutside={() => field.onBlur()}
              collection={trustPeriodList}
            >
              <SelectTrigger>
                <SelectValueText />
              </SelectTrigger>
              <SelectContent>
                {TrustPeriodOptions.items.map(option => (
                  <SelectItem item={option} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          )}
        />
      </Field>
      <input type="hidden" {...register('trustPeriod')} />
      <Field
        label="Link Expiry"
        errorText={
          errors.linkExpirySelect?.message?.toString() ||
          serverState.errors.linkExpiry?.toString()
        }
        my={2}
      >
        <Controller
          control={control}
          name="linkExpirySelect"
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={field.value}
              onValueChange={({ value }) => {
                setValue('linkExpiry', value[0] as '30' | '60' | '90' | '180');
                field.onChange(value);
              }}
              onInteractOutside={() => field.onBlur()}
              collection={linkExpiryList}
            >
              <SelectTrigger>
                <SelectValueText />
              </SelectTrigger>
              <SelectContent>
                {LinkExpiryOptions.items.map(option => (
                  <SelectItem item={option} key={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
          )}
        />
      </Field>
      <input type="hidden" {...register('linkExpiry')} />
      <Button type="submit" mt={2} disabled={isPending}>
        <LuShare />
        Generate Link
      </Button>
    </form>
  );
};

export default RequestFundsForm;
