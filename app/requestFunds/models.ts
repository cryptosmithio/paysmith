
import mongoose, * as pkg from 'mongoose';
import {
  genTimestampsSchema,
  mongooseZodCustomType,
  toMongooseSchema,
  toZodMongooseSchema,
} from 'mongoose-zod';
import { z } from 'zod';
import { FundsRequestSchema } from './schemas';

const { models } = pkg;

const fundsRequestZodMongooseSchema = toZodMongooseSchema(
  z
    .object({
      _id: mongooseZodCustomType('ObjectId').mongooseTypeOptions({
        _id: true,
        auto: true,
      }),
    })
    .merge(FundsRequestSchema)
    .merge(genTimestampsSchema()),
  {
    schemaOptions: {
      collection: 'fundsRequests',
      timestamps: true,
    },
  }
);

const fundsRequestMongooseSchema = toMongooseSchema(
  fundsRequestZodMongooseSchema
).index(
  {
    bcInvoiceId: 1,
  },
  {
    unique: true,
    partialFilterExpression: { bcInvoiceId: { $exists: true } }, // Only index documents that have the bcInvoiceId field
  }
);

type FundsRequestDocumentType = z.infer<typeof fundsRequestZodMongooseSchema>;
export type FundsRequestType = z.infer<typeof FundsRequestSchema>;

export type FundsRequestDocument = InstanceType<typeof FundsRequest>;

export const FundsRequest = models?.FundsRequest
  ? (models.FundsRequest as pkg.Model<FundsRequestDocumentType>)
  : mongoose.model<FundsRequestDocumentType>(
      'FundsRequest',
      fundsRequestMongooseSchema
    );
