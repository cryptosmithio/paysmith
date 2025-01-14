'use client';

import { Box } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

export default function Dashboard() {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <Box>Connect your wallet</Box>;
  } else {
    return <Box>Dashboard</Box>;
  }
}
