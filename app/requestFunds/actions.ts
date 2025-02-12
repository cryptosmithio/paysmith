'use server';

import dbConnect from '@/lib/dbConnect';
import {
  parseFormData,
  ServerFormStatus,
  type ServerFormStateType,
} from '@/lib/formUtil';
import { createInvoice } from '@/lib/server/bcUtil';
import { redirect } from 'next/navigation';
import { FundsRequestStatus } from './constants';
import { FundsRequest, type FundsRequestDocumentType } from './models';
import { FundsRequestDataSchema } from './schemas';

export async function requestFundsAction(
  prevState: ServerFormStateType,
  data: FormData
) {
  const { nextState, parsedData } = parseFormData(
    prevState,
    data,
    FundsRequestDataSchema
  );
  if (nextState.status !== ServerFormStatus.SUCCESS) {
    console.error('Request funds action failed');
    console.error('Errors:', nextState.errors);
    return nextState;
  }

  // Connect to MongoDB
  await dbConnect();

  // Create FundsRequest document
  const fundsRequest = (await FundsRequest.create(
    parsedData
  )) as FundsRequestDocumentType;

  // Create associated invoice
  const invoice = await createInvoice(fundsRequest);
  fundsRequest.bcInvoiceId = invoice.id;
  fundsRequest.status = FundsRequestStatus.AWAITING_FUNDS;
  await fundsRequest.save();

  console.log('Funds request created:', fundsRequest);
  // nextState.returnData = {
  //   fundsRequest: fundsRequest.toJSON({
  //     flattenMaps: true,
  //     flattenObjectIds: true,
  //   }),
  // };

  // return nextState;
  redirect(`/requestFunds/view/${fundsRequest._id}`);
}
