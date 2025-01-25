'use server';

import {
  parseFormData,
  ServerFormStatus,
  type ServerFormStateType,
} from '@/lib/formUtil';
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
  console.log('Request funds action data:', parsedData);
  if (nextState.status !== ServerFormStatus.SUCCESS) {
    console.log('Request funds action failed');
    console.log('Errors:', nextState.errors);
    return nextState;
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Request funds action succeeded');
  console.log('Next state:', nextState);
  return nextState;
}
