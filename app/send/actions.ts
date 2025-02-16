'use server';

import { parseFormData, type ServerFormStateType } from '@/lib/formUtil';
import { SendDataSchema } from './schemas';
export async function sendFundsAction(
  prevState: ServerFormStateType,
  data: FormData
) {
  const { nextState, parsedData } = parseFormData(
    prevState,
    data,
    SendDataSchema
  );

  console.log(parsedData);

  return nextState;
}
