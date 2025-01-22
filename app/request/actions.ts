'use server';

import { RequestDataSchema } from "./common";

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];

};

export async function requestFundsAction(data: FormData) {
  'use server';
  console.log(data);
  const formData = Object.fromEntries(data);
  const parsedData = RequestDataSchema.parse(formData);

  console.log(parsedData);

  // return {
  //   message: 'Funds requested successfully',
  // };
}
