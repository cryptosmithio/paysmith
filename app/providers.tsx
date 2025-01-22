'use client';

import {
  connectorsForWallets,
  midnightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  binanceWallet,
  braveWallet,
  injectedWallet,
  krakenWallet,
  ledgerWallet,
  oneKeyWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as React from 'react';
import { createClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig, WagmiProvider } from 'wagmi';
import { Provider } from './components/ui/provider';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        injectedWallet,
        binanceWallet,
        braveWallet,
        krakenWallet,
        ledgerWallet,
        oneKeyWallet,
        rainbowWallet,
        safeWallet,
        trustWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'PaySmith',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  }
);

const config = createConfig({
  connectors,
  chains: [
    mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
  client({ chain }) {
    return createClient({ chain, transport: http() });
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={midnightTheme()}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  );
}
