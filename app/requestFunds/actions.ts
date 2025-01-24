'use server';

import { parseFormData, type ServerFormStateType } from '@/lib/formUtil';
import { FundsRequestDataSchema, type FundsRequestDataSchemaType } from './schemas';

export async function requestFundsAction(prevState: ServerFormStateType, data: FormData) {
  const { nextState, parsedData } = parseFormData(prevState, data, FundsRequestDataSchema);
  if (!nextState.success) {
    return nextState;
  }
  const { paymentAmount, linkExpiry, trustPeriod } = parsedData as FundsRequestDataSchemaType;
  console.log('paymentAmount', paymentAmount);
  console.log('linkExpiry', linkExpiry);
  console.log('trustPeriod', trustPeriod);

  return nextState;
}
