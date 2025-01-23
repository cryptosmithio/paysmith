'use server';

import { parseFormData, type FormServerStateType } from '@/lib/util';
import { SendDataSchema } from './common';
export async function sendFundsAction(prevState: FormServerStateType, data: FormData) {
  const { nextState, parsedData } = parseFormData(prevState, data, SendDataSchema);

  console.log(parsedData);

  return nextState;
}
