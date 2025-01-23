'use client';

import { Field } from '@/app/components/ui/field';
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
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LuShare } from 'react-icons/lu';
import { Button } from '../components/ui/button';
import { requestFundsAction } from './actions';
import {
  linkExpiryOptions,
  RequestFormSchema,
  trustPeriodOptions,
  type RequestFormSchemaType,
} from './common';
import type { FormServerStateType } from '@/lib/util';

const RequestFundsForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [serverState, formAction] = useActionState(requestFundsAction, {
    message: '',
    fields: {},
    errors: {},
    success: false,
  } as FormServerStateType);
  const {
    register,
    getValues,
    control,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<RequestFormSchemaType>({
    resolver: zodResolver(RequestFormSchema),
    defaultValues: {
      linkExpirySelect: ['60'],
      trustPeriodSelect: ['24'],
      trustPeriod: '24',
      linkExpiry: '60',
      usdAmount: 0,
      ethAmount: 0,
    },
    progressive: true,
  });
  const exchangeRate = 3405; // get from Bitcart API
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

  const onSubmit = (data: RequestFormSchemaType) => {
    console.log(data);
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      startTransition(() => formAction(formData));
    }
  };

  const linkExpiryList = createListCollection(linkExpiryOptions);
  const trustPeriodList = createListCollection(trustPeriodOptions);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)} //allows client side validation
      ref={formRef}
    >
      <Field
        label="Requested Amount"
        invalid
        errorText={
          errors.ethAmount?.message?.toString() ||
          serverState.errors.ethAmount?.toString()
        }
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
          </HStack>
        </VStack>
      </Field>
      <Field
        label="Trust Period"
        invalid
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
                setValue('trustPeriod', value[0]);
                field.onChange(value);
              }}
              onInteractOutside={() => field.onBlur()}
              collection={trustPeriodList}
            >
              <SelectTrigger>
                <SelectValueText />
              </SelectTrigger>
              <SelectContent>
                {trustPeriodOptions.items.map(option => (
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
        invalid
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
                setValue('linkExpiry', value[0]);
                field.onChange(value);
              }}
              onInteractOutside={() => field.onBlur()}
              collection={linkExpiryList}
            >
              <SelectTrigger>
                <SelectValueText />
              </SelectTrigger>
              <SelectContent>
                {linkExpiryOptions.items.map(option => (
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
      <Button type="submit" mt={2}>
        <LuShare />
        Generate Link
      </Button>
    </form>
  );
};

export default RequestFundsForm;
