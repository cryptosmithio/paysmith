'use client';
import { Avatar } from '@/app/components/ui/avatar';
import { ClipboardIconButton, ClipboardRoot } from '@/app/components/ui/clipboard';
import { getFundsRequestById, initiateFundsPayment } from '@/app/requestFunds/actions';
import { FundsRequestStatus } from '@/app/requestFunds/schemas';
import { Button, Card, HStack, Spinner, Stack, Text, VStack } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FaEthereum } from 'react-icons/fa6';
import spacetime from 'spacetime';
import { useAccount, useSendTransaction } from 'wagmi';
const ViewRequest = ({ id }: { id: string; }) => {
  const {
    data: fundsRequest,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['fundsRequest', id],
    queryFn: () => getFundsRequestById(id),
    refetchInterval: 10000,
  });
  const [isPending, setIsPending] = useState(false);
  const account = useAccount();
  const expired = !fundsRequest || fundsRequest.status === FundsRequestStatus.EXPIRED;
  const [canPay, setCanPay] = useState(account.isConnected && !expired && !isPending);
  const { data: hash, sendTransaction } = useSendTransaction();
  const [viewUrl, setViewUrl] = useState('');
  const payRequest = async () => {
    setIsPending(true);
    await initiateFundsPayment(fundsRequest!.bcInvoiceId, account.address as string);
    sendTransaction({
      to: fundsRequest!.recipientAddress,
      value: fundsRequest!.amount,
    });
    setIsPending(false);

    return hash;
  };
  useEffect(() => {
    setCanPay(account.isConnected && !expired && !isPending);
  }, [account.isConnected, expired, isPending]);

  useEffect(() => {
    setViewUrl(window.location.href);
  }, []);
  if (error) {
    return <Text>Error loading funds request</Text>;
  }
  if (isLoading || !fundsRequest) {
    return <Spinner />;
  }
  const expiryDate = spacetime(fundsRequest.expiryDate);

  return (
    <Card.Root variant="elevated" boxShadow="lg" maxW={'md'} textStyle="sm">
      <Card.Header gap="1">
        <Card.Title>Paysmith Request</Card.Title>
        <Card.Description>
          You are requested to pay {fundsRequest.recipientName} via Paysmith, a
          safe and secure way to payment platform on the blockchain.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <HStack mt={4}>
          <Avatar
            src={fundsRequest.recipientAvatar as string}
            name={fundsRequest.recipientName as string}
          />
          <Stack gap="0">
            <Text fontWeight="semibold">{fundsRequest.recipientName}</Text>
            <Text color="fg.muted" textStyle="xs">
              {fundsRequest.recipientAddress}
            </Text>
          </Stack>
        </HStack>
        <HStack mt={4}>
          <Text fontWeight="semibold">Amount:</Text>
          <Text color="fg.muted">
            {fundsRequest.amount} {fundsRequest.currency}
          </Text>
        </HStack>

        <HStack mt={4}>
          <Text fontWeight="semibold">
            These funds will be held for {fundsRequest.trustPeriod} hours in
            trust after full deposit verification.
          </Text>
        </HStack>

        <Stack mt={4}>
          <Text fontWeight="semibold">Notes:</Text>
          <Text color="fg.muted">{fundsRequest.notes}</Text>
          <Text color={expired ? 'red' : 'green'}>
            Expires: {expiryDate.toNativeDate().toLocaleString()}
          </Text>
          <Text fontWeight="semibold">Status:</Text>
          <Text color="fg.muted">{fundsRequest.status}</Text>
        </Stack>
      </Card.Body>
      <Card.Footer justifyContent={'center'}>
        <VStack>
          <HStack>
            <ConnectButton />
          </HStack>
          <HStack gap={4} mt={4} justify={'center'}>
            <ClipboardRoot value={viewUrl}>
              <ClipboardIconButton bgColor={'white'} color={"black"} />
            </ClipboardRoot>
            <Button onClick={payRequest} disabled={!canPay} >
              <FaEthereum />
              Pay
            </Button>
            {isPending && <Spinner size={"md"} color={'white'} />}
          </HStack>

        </VStack>
      </Card.Footer>
    </Card.Root>
  );
};
export default ViewRequest;
