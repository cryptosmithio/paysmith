

import { moneySchema } from '@/lib/schemas';
import { isAddress } from 'viem';
import * as zod from 'zod';
import { LinkExpiryValues, TrustPeriodValues } from './constants';

export const FundsRequestDataSchema = zod.object({
  paymentAddress: zod.string().min(1, 'Address is required').refine(value => {
    return isAddress(value);
  }, 'Address must be valid Ethereum address'),
  linkExpiry: zod.enum(LinkExpiryValues),
  trustPeriod: zod.enum(TrustPeriodValues),
  notes: zod.string().max(255, 'Notes must be less than 255 characters').optional(),
  paymentName: zod.string().max(50, 'Name must be less than 50 characters').optional(),
  paymentAmount: moneySchema.required(),
  bcInvoiceId: zod.z.string().trim().optional(),
});// Server side validation and object creation

export const RequestFundsFormSchema = zod.object({
  usdAmount: zod.coerce.number().positive('Amount should be greater than 0'),
  linkExpirySelect: zod.string().nonempty('Link expiry is required').array(),
  trustPeriodSelect: zod.string().nonempty('Trust period is required').array(),
  ethAmount: zod.coerce.number().positive('Amount should be greater than 0'),
  paymentAddress: zod.string().min(1, 'Address is required').refine(value => {
    return isAddress(value);
  }, 'Address must be valid Ethereum address'),
  linkExpiry: zod.enum(LinkExpiryValues),
  trustPeriod: zod.enum(TrustPeriodValues),
  notes: zod.string().max(255, 'Notes must be less than 255 characters').optional(),
  paymentName: zod.string().max(50, 'Name must be less than 50 characters').optional()
}); // Client side validation

export type RequestFundsFormSchemaType = zod.infer<typeof RequestFundsFormSchema>;

export type FundsRequestDataSchemaType = zod.infer<typeof FundsRequestDataSchema>;
