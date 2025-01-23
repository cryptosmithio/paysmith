'use client';

import { Box, Tabs } from '@chakra-ui/react';
import { LuRows3, LuSend, LuShare } from 'react-icons/lu';
import { useAccount } from 'wagmi';
import RequestForm from '../request/RequestFundsForm';
import SendForm from '../send/SendFundsForm';
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
        <SendForm />
      </Tabs.Content>
      <Tabs.Content value="request">
        <RequestForm />
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
