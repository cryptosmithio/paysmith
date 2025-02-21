'use server';

import type { BCPaymentType } from '@/lib/constants';
import {
  parseFormData,
  ServerFormStatus,
  type ServerFormStateType,
} from '@/lib/formUtil';
import { createInvoice, updatePaymentAddressByInvoiceId } from '@/lib/server/bcUtil';
import dbConnect from '@/lib/server/dbConnect';
import { redirect } from 'next/navigation';
import spacetime from 'spacetime';
import { FundsRequest, type FundsRequestType } from './models';
import { FundsRequestSchema, FundsRequestStatus } from './schemas';

export async function createFundsRequest(
  prevState: ServerFormStateType,
  data: FormData
) {
  const { nextState, parsedData } = parseFormData(
    prevState,
    data,
    FundsRequestSchema
  );
  if (nextState.status !== ServerFormStatus.SUCCESS) {
    console.error('Request funds action failed');
    console.error('Errors:', nextState.errors);
    return nextState;
  }

  // Connect to MongoDB
  await dbConnect();

  // Create FundsRequest document
  const fundsRequest = await FundsRequest.create(parsedData);

  // Add expiry date
  fundsRequest.expiryDate = spacetime
    .now()
    .add(Number(fundsRequest.linkExpiry), 'minutes')
    .toNativeDate();

  // Create associated invoice
  const invoice = await createInvoice(fundsRequest);
  const currentPayment = invoice?.payments?.[
    invoice?.payments?.length - 1
  ] as BCPaymentType;
  // Update FundsRequest document
  fundsRequest.bcInvoiceId = invoice.id;
  fundsRequest.status = FundsRequestStatus.AWAITING_FUNDS;
  fundsRequest.trustAddress = currentPayment?.payment_address as `0x${string}`;
  await fundsRequest.save();

  console.log('Funds request created:', fundsRequest);
  console.log('Invoice created:', invoice);
  console.log('Current payment:', currentPayment);
  // nextState.returnData = {
  //   fundsRequest: fundsRequest.toJSON({
  //     flattenMaps: true,
  //     flattenObjectIds: true,
  //   }),
  // };

  // return nextState;
  redirect(`/requestFunds/view/${fundsRequest._id}`);
}
export async function getFundsRequestById(id: string) {
  await dbConnect();
  const fundsRequest = await FundsRequest.findById(id);
  return JSON.parse(JSON.stringify(fundsRequest)) as FundsRequestType;
}

export async function initiateFundsPayment(fundsRequestId: string, bcInvoiceId: string, sender: {
  address: string;
  name?: string;
  avatar?: string;
  notes?: string;
}) {
  await dbConnect();
  FundsRequest.updateOne({ _id: fundsRequestId },
    { status: FundsRequestStatus.PAYMENT_INITIATED, senderAddress: sender.address, senderName: sender.name, senderAvatar: sender.avatar, senderNotes: sender.notes });
  updatePaymentAddressByInvoiceId(bcInvoiceId, sender.address);
}