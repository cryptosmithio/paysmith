import type { FundsRequestDocumentType } from '../../models';

const ViewRequest = (fundsRequest: FundsRequestDocumentType) => {
  return (
    <div>
      <div>Payment Address: {fundsRequest.paymentAddress}</div>
      <div>Link Expiry: {fundsRequest.linkExpiry}</div>
      <div>Trust Period: {fundsRequest.trustPeriod}</div>
      <div>Notes: {fundsRequest.notes}</div>
      <div>Payment Name: {fundsRequest.paymentName}</div>
      <div>Amount: {fundsRequest.amount}</div>
      <div>Currency: {fundsRequest.currency}</div>
      <div>BC Invoice Id: {fundsRequest.bcInvoiceId}</div>
    </div>
  );
};

export default ViewRequest;
