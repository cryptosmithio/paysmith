import { Button, Card, HStack, Separator, Stack, Text } from '@chakra-ui/react';
import type { FundsRequestDocumentType } from '../../models';

const ViewRequest = ({
  fundsRequest,
}: {
  fundsRequest: FundsRequestDocumentType;
}) => {
  return (
    <Card.Root variant="elevated" boxShadow="lg">
      <Card.Header gap="1">
        <Card.Title>Paysmith</Card.Title>
        <Card.Description>Funds Request</Card.Description>
      </Card.Header>
      <Card.Body>
        <Stack gap="4" width="full">
          <Stack direction="row" gap="3">
            <Button variant="outline" colorPalette="gray" flex="1">
              Google
            </Button>
            <Button variant="outline" colorPalette="gray" flex="1">
              GitHub
            </Button>
          </Stack>
          <HStack gap="2">
            <Separator />
            <Text color="fg.subtle" textStyle="sm" whiteSpace="nowrap">
              or sign up with
            </Text>
            <Separator />
          </HStack>
        </Stack>
      </Card.Body>
      <Card.Footer>
        <Button width="full">Create Account</Button>
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
