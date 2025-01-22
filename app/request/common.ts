

import * as zod from 'zod';

const linkExpiryValues = ['30', '60', '90', '180'] as const;
const trustPeriodValues = ['1', '8', '24', '48', '72', 'NONE'] as const;

export const RequestFormSchema = zod.object({
  usdAmount: zod.coerce.number().positive('Amount should be greater than 0'),
  ethAmount: zod.coerce.number().positive('Amount should be greater than 0'),
  linkExpiry: zod.string().nonempty('Link expiry is required').array(),
  trustPeriod: zod.string().nonempty('Trust period is required').array(),
});

export const RequestDataSchema = zod.object({
  ethAmount: zod.number().positive('Amount should be greater than 0'),
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
