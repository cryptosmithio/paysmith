'use client';

import CreateRequestForm from '@/app/requestFunds/CreateRequestForm';
import SendFundsForm from '@/app/send/SendFundsForm';
import { Box, Tabs, useTabs } from '@chakra-ui/react';
import { LuRows3, LuSend, LuShare } from 'react-icons/lu';
import { useAccount } from 'wagmi';
const Transactions = () => {
  return <Box>Transactions</Box>;
};

const MainTabs = () => {
  const tabs = useTabs({
    defaultValue: 'request',
  });
  return (
    <Tabs.RootProvider value={tabs}>
      <Tabs.List>
        <Tabs.Trigger value="request">
          <LuShare />
          Request Funds
        </Tabs.Trigger>
        <Tabs.Trigger value="send">
          <LuSend />
          Send Funds
        </Tabs.Trigger>

        <Tabs.Trigger value="transactions">
          <LuRows3 />
          Transactions
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="send">
        <SendFundsForm />
      </Tabs.Content>
      <Tabs.Content value="request">
        <CreateRequestForm />
      </Tabs.Content>
      <Tabs.Content value="transactions">
        <Transactions />
      </Tabs.Content>
    </Tabs.RootProvider>
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
