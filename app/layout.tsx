import { Provider } from '@/components/ui/provider';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'PaySmith',
  description: 'PaySmith',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Providers>{children}</Providers>
        </Provider>
      </body>
    </html>
  );
}
