'use server';

import { parseFormData, type FormServerStateType } from '@/lib/util';
import { RequestDataSchema } from './common';

export async function requestFundsAction(prevState: FormServerStateType, data: FormData) {
  const { nextState, parsedData } = parseFormData(prevState, data, RequestDataSchema);

  console.log(parsedData);

  return nextState;
}
