'use server';

import dbConnect from '@/lib/dbConnect';
import {
  parseFormData,
  ServerFormStatus,
  type ServerFormStateType,
} from '@/lib/formUtil';
import { redirect } from 'next/navigation';
import { FundsRequest } from './models';
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
    console.log('Request funds action failed');
    console.log('Errors:', nextState.errors);
    return nextState;
  }

  // Connect to MongoDB
  await dbConnect();

  // Create FundsRequest document
  const fundsRequest = await FundsRequest.create(parsedData);

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
