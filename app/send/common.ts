

import { isAddress } from 'viem';
import * as zod from 'zod';

export const SendFormSchema = zod.object({
  address: zod
    .string()
    .min(1, 'Address is required')
    .refine(value => {
      return isAddress(value);
    }, 'Address must be valid Ethereum address'),
  usdAmount: zod.coerce.number().positive('Amount should be greater than 0'),
  ethAmount: zod.coerce.number().positive('Amount should be greater than 0'),
});

export const SendDataSchema = SendFormSchema.omit({
  usdAmount: true,
});

export type SendFormSchemaType = zod.infer<typeof SendFormSchema>;
export type SendDataSchemaType = zod.infer<typeof SendDataSchema>;