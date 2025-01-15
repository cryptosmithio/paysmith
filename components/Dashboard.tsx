'use client';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Box, Input, Tabs } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LuRows3, LuSend, LuShare } from 'react-icons/lu';
import { useAccount } from 'wagmi';

const Send = () => {
  type SendInputs = {
    address: string;
    amount: string;
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SendInputs>();

  const onSubmit: SubmitHandler<SendInputs> = data => console.log(data);

  console.log(watch('address')); // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field label="Address" errorText={errors.address?.message}>
        <Input placeholder="0x0" {...register('address')} required />
      </Field>
      <Field label="Amount" errorText={errors.amount?.message}>
        <Input placeholder="0" {...register('amount')} required />
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
