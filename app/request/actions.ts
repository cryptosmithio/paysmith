'use server';

import { RequestDataSchema, type RequestFormServerState } from "./common";

export async function requestFundsAction(prevState: RequestFormServerState, data: FormData) {
  console.log(data);
  const formData = Object.fromEntries(data);
  const parsedData = RequestDataSchema.parse(formData);

  console.log(parsedData);

  return prevState;
}
