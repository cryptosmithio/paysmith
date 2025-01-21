'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '@/components/ui/select';
import {
  Box,
  createListCollection,
  HStack,
  Input,
  InputAddon,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { LuRows3, LuSend, LuShare } from 'react-icons/lu';
import { formatEther, isAddress } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import * as zod from 'zod';
const exchangeRate = 3405; // get from Bitcart API

const Send = () => {
  const { address } = useAccount();
  const balance = useBalance({ address });

  const maxEthAmount = balance.data
    ? Number(formatEther(balance.data?.value))
    : 0;

  const SendFormSchema = zod.object({
    address: zod
      .string()
      .min(1, 'Address is required')
      .refine(value => {
        return isAddress(value);
      }, 'Address must be valid Ethereum address'),
    usdAmount: zod.coerce.number().positive('Amount should be greater than 0'),
    ethAmount: zod.coerce
      .number()
      .positive('Amount should be greater than 0')
      .max(maxEthAmount, 'Amount should be equal or less than your balance'),
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SendFormSchema),
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
      setValue('ethAmount', formattedBalance);
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

const Request = () => {
  const linkExpiryOptions = createListCollection({
    items: [
      { value: '30', label: '30 minutes' },
      { value: '60', label: '60 minutes' },
      { value: '90', label: '90 minutes' },
    ],
  });

  const trustPeriodOptions = createListCollection({
    items: [
      { value: '1', label: '1 hour' },
      { value: '8', label: '8 hours' },
      { value: '24', label: '24 hours' },
      { value: '48', label: '48 hours' },
      { value: '72', label: '72 hours' },
      { value: 'NONE', label: 'No Limit' },
    ],
  });

  const receiveFormSchema = zod.object({
    usdAmount: zod.coerce.number().positive('Amount should be greater than 0'),
    ethAmount: zod.coerce.number().positive('Amount should be greater than 0'),
    linkExpiry: zod.string().nonempty('Link expiry is required').array(),
    trustPeriod: zod.string().nonempty('Trust period is required').array(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(receiveFormSchema),
    defaultValues: {
      linkExpiry: ['60'],
      trustPeriod: ['24'],
      usdAmount: 0,
      ethAmount: 0,
    },
  });

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

  const onSubmit = handleSubmit(data => {
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <Field
        label="Requested Amount"
        invalid
        errorText={errors.ethAmount?.message?.toString()}
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
        errorText={errors.trustPeriod?.message?.toString()}
        my={2}
      >
        <Controller
          control={control}
          name="trustPeriod"
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={field.value}
              onValueChange={({ value }) => field.onChange(value)}
              onInteractOutside={() => field.onBlur()}
              collection={trustPeriodOptions}
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
      <Field
        label="Link Expiry"
        invalid
        errorText={errors.linkExpiry?.message?.toString()}
        my={2}
      >
        <Controller
          control={control}
          name="linkExpiry"
          render={({ field }) => (
            <SelectRoot
              name={field.name}
              value={field.value}
              onValueChange={({ value }) => field.onChange(value)}
              onInteractOutside={() => field.onBlur()}
              collection={linkExpiryOptions}
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
      <Button type="submit" mt={2}>
        <LuShare />
        Generate Link
      </Button>
    </form>
  );
};

const Transactions = () => {
  return <Box>Transactions</Box>;
};

const MainTabs = () => {
  return (
    <Tabs.Root defaultValue="request">
      <Tabs.List>
        <Tabs.Trigger value="request">
          <LuShare />
          Request Funds
        </Tabs.Trigger>
        <Tabs.Trigger value="send">
          <LuSend />
          Send
        </Tabs.Trigger>

        <Tabs.Trigger value="transactions">
          <LuRows3 />
          Transactions
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="send">
        <Send />
      </Tabs.Content>
      <Tabs.Content value="request">
        <Request />
      </Tabs.Content>
      <Tabs.Content value="transactions">
        <Transactions />
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default function Dashboard() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <Box>Connect your wallet</Box>;
  } else {
    return <MainTabs />;
  }
}
