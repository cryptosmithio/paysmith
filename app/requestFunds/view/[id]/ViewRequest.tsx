'use client';
import { Avatar } from '@/app/components/ui/avatar';
import { FundsRequestType } from '@/app/requestFunds/models';
import { Button, Card, HStack, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import spacetime from 'spacetime';
import { getFundsRequestById } from '../../actions';
const ViewRequest = ({
  fundsRequest,
  id,
}: {
  fundsRequest: FundsRequestType;
  id: string;
}) => {
  const expiryDate = spacetime(fundsRequest.expiryDate);
  const expired = expiryDate.isBefore(spacetime.now());
  const { data, error } = useQuery({
    queryKey: ['fundsRequest', id],
    queryFn: () => getFundsRequestById(id),
    initialData: fundsRequest,
  });
  if (error) {
    return <Text>Error loading funds request</Text>;
  }
  if (!data) {
    return <Text>Loading...</Text>;
  }
  return (
    <Card.Root variant="elevated" boxShadow="lg" maxW={'md'} textStyle="sm">
      <Card.Header gap="1">
        <Card.Title>Paysmith Request</Card.Title>
        <Card.Description>
          You are requested to pay {data.recipientName} via Paysmith, a safe and
          secure way to payment platform on the blockchain.
        </Card.Description>
      </Card.Header>
      <Card.Body>
        <HStack mt={4}>
          <Avatar
            src={data.recipientAvatar as string}
            name={data.recipientName as string}
          />
          <Stack gap="0">
            <Text fontWeight="semibold">{data.recipientName}</Text>
            <Text color="fg.muted" textStyle="xs">
              {data.recipientAddress}
            </Text>
          </Stack>
        </HStack>
        <HStack mt={4}>
          <Text fontWeight="semibold">Amount:</Text>
          <Text color="fg.muted">
            {data.amount} {data.currency}
          </Text>
        </HStack>

        <HStack mt={4}>
          <Text fontWeight="semibold">
            These funds will be held for {data.trustPeriod} hours in trust after
            full deposit verification.
          </Text>
        </HStack>

        <Stack mt={4}>
          <Text fontWeight="semibold">Notes:</Text>
          <Text color="fg.muted">{data.notes}</Text>
          <Text color={expired ? 'red' : 'green'}>
            Expires: {expiryDate.toNativeDate().toLocaleString()}
          </Text>
          <Text fontWeight="semibold">Status:</Text>
          <Text color="fg.muted">{data.status}</Text>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button width="full">Pay</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default ViewRequest;
