

import * as zod from 'zod';

const linkExpiryValues = ['30', '60', '90', '180'] as const;
const trustPeriodValues = ['1', '8', '24', '48', '72', 'NONE'] as const;

export const RequestFormSchema = zod.object({
  usdAmount: zod.coerce.number().positive('Amount should be greater than 0'),
  ethAmount: zod.coerce.number().positive('Amount should be greater than 0'),
  linkExpirySelect: zod.string().nonempty('Link expiry is required').array(),
  trustPeriodSelect: zod.string().nonempty('Trust period is required').array(),
  trustPeriod: zod.string().nonempty('Trust period is required'),
  linkExpiry: zod.string().nonempty('Link expiry is required'),
});

export const RequestDataSchema = zod.object({
  ethAmount: zod.coerce.number().positive('Amount should be greater than 0'),
  linkExpiry: zod.enum(linkExpiryValues),
  trustPeriod: zod.enum(trustPeriodValues),
});

export type RequestFormSchemaType = zod.infer<typeof RequestFormSchema>;

export const linkExpiryOptions = {
  items: linkExpiryValues.map(value => ({
    value,
    label: `${value} minutes`,
  })),
};

export const trustPeriodOptions = {
  items: trustPeriodValues.map(value => ({
    value,
    label: value === 'NONE' ? 'No Limit' : value === '1' ? '1 hour' : `${value} hours`,
  })),
};

export type RequestFormServerState = {
  message?: string;
  fields?: Record<string, string>;
  errors?: Record<string, string>;
};
