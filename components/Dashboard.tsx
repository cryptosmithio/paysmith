'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Box, HStack, Input, InputAddon, Tabs, VStack } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LuRows3, LuSend, LuShare } from 'react-icons/lu';
import { formatEther, isAddress } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import * as zod from 'zod';

const Send = () => {
  const SendFormSchema = zod.object({
    address: zod
      .string()
      .min(1, 'Address is required')
      .refine(value => {
        return isAddress(value);
      }, 'Address must be valid Ethereum address'),
    amount: zod.coerce.number().positive('Amount should be greater than 0'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SendFormSchema),
  });

  const onSubmit = handleSubmit(data => {
    console.log(data);
  });

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
        mt={2}
        label="Amount"
        invalid
        errorText={errors.amount?.message?.toString()}
      >
        <Input placeholder="0" {...register('amount')} />
      </Field>
      <Button type="submit" mt={2}>
        Send
      </Button>
    </form>
  );
};

const Request = () => {
  const { address } = useAccount();
  const balance = useBalance({ address });
  const maxEthAmount = balance.data
    ? Number(formatEther(balance.data?.value))
    : 0;
  const receiveFormSchema = zod.object({
    usdAmount: zod.coerce.number().positive('Amount should be greater than 0'),
    ethAmount: zod.coerce
      .number()
      .positive('Amount should be greater than 0')
      .max(maxEthAmount, 'Amount should be equal or less than your balance'),
  });
  const exchangeRate = 3405;

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(receiveFormSchema),
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

  const onSubmit = handleSubmit(data => {
    console.log(data);
  });

  return (
    <form onSubmit={onSubmit}>
      <Field
        mt={2}
        label="Requested Amount"
        invalid
        errorText={errors.ethAmount?.message?.toString()}
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
