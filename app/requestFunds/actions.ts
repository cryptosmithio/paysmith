'use server';

import { parseFormData, type ServerFormStateType } from '@/lib/formUtil';
import { FundsRequestDataSchema } from './schemas';

export async function requestFundsAction(prevState: ServerFormStateType, data: FormData) {
  const { nextState, parsedData } = parseFormData(prevState, data, FundsRequestDataSchema);
  console.log('Request funds action data:', parsedData);
  if (!nextState.success) {
    console.log('Request funds action failed');
    console.log('Errors:', nextState.errors);
    return nextState;
  }

  console.log('Request funds action succeeded');
  console.log('Next state:', nextState);
  return nextState;
}
