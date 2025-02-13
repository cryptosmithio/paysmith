'use client';
import { Avatar } from '@/app/components/ui/avatar';
import { getFundsRequestById } from '@/app/requestFunds/actions';
import { FundsRequestStatus } from '@/app/requestFunds/schemas';
import {
  Button,
  Card,
  HStack,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import spacetime from 'spacetime';
const ViewRequest = ({ id }: { id: string }) => {
  const {
    data: fundsRequest,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['fundsRequest', id],
    queryFn: () => getFundsRequestById(id),
    refetchInterval: 10000,
  });
  if (error) {
    return <Text>Error loading funds request</Text>;
  }
  if (isLoading || !fundsRequest) {
    return (
      <VStack colorPalette="teal" w={'vw'} h={'vh'} justifyContent={'center'}>
        <Spinner color="colorPalette.600" />
        <Text color="colorPalette.600">Loading...</Text>
      </VStack>
    );
  }
  const expiryDate = spacetime(fundsRequest.expiryDate);
  const expired = fundsRequest.status === FundsRequestStatus.EXPIRED;

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
      <Card.Footer>
        <Button width="full">Pay</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default ViewRequest;
