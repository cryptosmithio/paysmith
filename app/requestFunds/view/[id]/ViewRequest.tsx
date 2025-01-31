import { Avatar } from '@/app/components/ui/avatar';
import type { FundsRequestDocumentType } from '@/app/requestFunds/models';
import { Button, Card, HStack, Stack, Text } from '@chakra-ui/react';

const ViewRequest = ({
  fundsRequest,
}: {
  fundsRequest: FundsRequestDocumentType;
}) => {
  return (
    <Card.Root variant="elevated" boxShadow="lg" maxW={'md'}>
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
            <Text fontWeight="semibold" textStyle="sm">
              {fundsRequest.recipientName}
            </Text>
            <Text color="fg.muted" textStyle="xs">
              {fundsRequest.recipientAddress}
            </Text>
          </Stack>
        </HStack>

        <Stack mt={4}>
          <Text fontWeight="semibold" textStyle="sm">
            Notes:
          </Text>
          <Text color="fg.muted" textStyle="sm">
            {fundsRequest.notes}
          </Text>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button width="full">Pay</Button>
      </Card.Footer>

      <div>
        <div>Payment Address: {fundsRequest.recipientAddress}</div>
        <div>Link Expiry: {fundsRequest.linkExpiry}</div>
        <div>Trust Period: {fundsRequest.trustPeriod}</div>
        <div>Notes: {fundsRequest.notes}</div>
        <div>Payment Name: {fundsRequest.recipientName}</div>
        <div>Amount: {fundsRequest.amount}</div>
        <div>Currency: {fundsRequest.currency}</div>
        <div>BC Invoice Id: {fundsRequest.bcInvoiceId}</div>
      </div>
    </Card.Root>
  );
};

export default ViewRequest;
