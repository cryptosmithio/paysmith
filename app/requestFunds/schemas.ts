import { CurrencyType } from '@/lib/constants';
import { isAddress } from 'viem';
import * as zod from 'zod';
import {
  FundsRequestStatus,
  LinkExpiryValues,
  TrustPeriodValues,
} from './constants';

export const FundsRequestSchema = zod.object({
  recipientAddress: zod
    .string()
    .min(1, 'Address is required')
    .refine(value => {
      return isAddress(value);
    }, 'Address must be valid Ethereum address'),
  linkExpiry: zod.enum(LinkExpiryValues),
  trustPeriod: zod.enum(TrustPeriodValues),
  notes: zod
    .string()
    .max(255, 'Notes must be less than 255 characters')
    .optional(),
  recipientName: zod
    .string()
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  recipientAvatar: zod.string().optional(),
  amount: zod.coerce
    .number()
    .positive('Amount should be greater than 0')
    .default(0),
  currency: zod.nativeEnum(CurrencyType).default(CurrencyType.ETH),
  bcInvoiceId: zod.string().trim().optional(),
  status: zod
    .nativeEnum(FundsRequestStatus)
    .default(FundsRequestStatus.CREATED),
  expiryDate: zod.date().optional(),
}); // Server side validation and object creation

export const RequestFundsFormSchema = zod
  .object({
    linkExpirySelect: zod.string().nonempty('Link expiry is required').array(),
    trustPeriodSelect: zod
      .string()
      .nonempty('Trust period is required')
      .array(),
    usdAmount: zod.coerce.number().min(0, 'Amount must be greater than 0'),
  })
  .merge(FundsRequestSchema); // Client side validation
