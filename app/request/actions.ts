'use server';

import { parseFormData, type ServerFormStateType } from '@/lib/util';
import { RequestDataSchema, type RequestDataSchemaType } from './common';

// Ensure that RequestDataSchema includes trustPeriod

export async function requestFundsAction(prevState: ServerFormStateType, data: FormData) {
  const { nextState, parsedData } = parseFormData(prevState, data, RequestDataSchema);
  if (!nextState.success) {
    return nextState;
  }
  const { ethAmount, linkExpiry, trustPeriod } = parsedData as RequestDataSchemaType;
  console.log('ethAmount', ethAmount);
  console.log('linkExpiry', linkExpiry);
  console.log('trustPeriod', trustPeriod);

  return nextState;
}
