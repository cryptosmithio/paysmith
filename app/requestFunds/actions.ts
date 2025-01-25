'use server';

import {
  parseFormData,
  ServerFormStatus,
  type ServerFormStateType,
} from '@/lib/formUtil';
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

  // Create FundsRequest document
  const fundsRequest = new FundsRequest(parsedData);

  console.log('Funds request created:', fundsRequest);
  nextState.returnData = {
    fundsRequest: fundsRequest.toJSON({
      flattenMaps: true,
      flattenObjectIds: true,
    }),
  };

  return nextState;
}
