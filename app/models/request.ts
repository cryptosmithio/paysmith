import mongoose, * as pkg from 'mongoose';
import {
  genTimestampsSchema,
  mongooseZodCustomType,
  toMongooseSchema,
  toZodMongooseSchema,
} from 'mongoose-zod';
import { isAddress } from 'viem';
import { z } from 'zod';
import { moneySchema } from './common';

const { models } = pkg;

const requestSchema = toZodMongooseSchema(
  z
    .object({
      _id: mongooseZodCustomType('ObjectId').mongooseTypeOptions({
        _id: true,
        auto: true,
      }),
      paymentAddress: z
        .string()
        .trim()
        .refine(value => {
              return isAddress(value);
            }, 'Address must be valid Ethereum address')
        .optional(),
      amount: moneySchema,
      bcInvoiceId: z.string().trim().optional(),
    })
    .merge(genTimestampsSchema()),
  {
    schemaOptions: {
      collection: 'requests',
    },
  }
);

const requestMongooseSchema = toMongooseSchema(requestSchema);

export type RequestDocument = InstanceType<typeof Request>;

export type RequestDocumentType = z.infer<typeof requestSchema>;

export const Request = models?.Request
  ? (models.Request as pkg.Model<RequestDocumentType>)
  : mongoose.model<RequestDocumentType>('Request', requestMongooseSchema);
