'use server';

import { parseFormData, type ServerFormStateType } from '@/lib/util';
import { RequestDataSchema } from './common';

export async function requestFundsAction(prevState: ServerFormStateType, data: FormData) {
  const { nextState, parsedData } = parseFormData(prevState, data, RequestDataSchema);

  console.log(parsedData);

  return nextState;
}
