import { Avatar } from '@/app/components/ui/avatar';
import type { FundsRequestDocumentType } from '@/app/requestFunds/models';
import { Button, Card, HStack, Stack, Text } from '@chakra-ui/react';
import spacetime from 'spacetime';

const ViewRequest = ({
  fundsRequest,
}: {
  fundsRequest: FundsRequestDocumentType;
}) => {
  const expiryTime = spacetime(fundsRequest.createdAt).add(
    Number(fundsRequest.linkExpiry),
    'minutes'
  );
  const expired = expiryTime.isBefore(spacetime.now());
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
            trust after deposit
          </Text>
        </HStack>

        <Stack mt={4}>
          <Text fontWeight="semibold">Notes:</Text>
          <Text color="fg.muted">{fundsRequest.notes}</Text>
          <Text color={expired ? 'red' : 'green'}>
            Expires: {expiryTime.toNativeDate().toLocaleString()}
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
