'use server';

import { parseFormData, type ServerFormStateType } from '@/lib/util';
import { SendDataSchema } from './common';
export async function sendFundsAction(prevState: ServerFormStateType, data: FormData) {
  const { nextState, parsedData } = parseFormData(prevState, data, SendDataSchema);

  console.log(parsedData);

  return nextState;
}
