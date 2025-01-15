'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Box, Input, Tabs } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LuRows3, LuSend, LuShare } from 'react-icons/lu';
import { useAccount } from 'wagmi';
import * as zod from 'zod';

const Send = () => {
  const SendFormSchema = zod.object({
    address: zod.string().min(10, 'Address is required'),
    amount: zod.string().min(1, 'Amount is required'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SendFormSchema),
  });

  const onSubmit = handleSubmit(data => {
    console.log(errors);
    console.log(data);
  });
  // watch input value by passing the name of it
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={onSubmit}>
      <Field
        label="Address"
        invalid
        errorText={errors.address?.message?.toString()}
      >
        <Input placeholder="0x0" {...register('address')} />
      </Field>
      <Field
        label="Amount"
        invalid
        errorText={errors.amount?.message?.toString()}
      >
        <Input placeholder="0" {...register('amount')} />
      </Field>
      <Button type="submit">Send</Button>
    </form>
  );
};

const Request = () => {
  return <Box>Request</Box>;
};

const Transactions = () => {
  return <Box>Transactions</Box>;
};

const MainTabs = () => {
  return (
    <Tabs.Root defaultValue="send">
      <Tabs.List>
        <Tabs.Trigger value="send">
          <LuSend />
          Send
        </Tabs.Trigger>
        <Tabs.Trigger value="request">
          <LuShare />
          Request Funds
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
