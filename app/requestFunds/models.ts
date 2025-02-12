import mongoose, * as pkg from 'mongoose';
import {
  genTimestampsSchema,
  mongooseZodCustomType,
  toMongooseSchema,
  toZodMongooseSchema,
} from 'mongoose-zod';
import { z } from 'zod';
import { FundsRequestDataSchema } from './schemas';

const { models } = pkg;

const fundsRequestZodMongooseSchema = toZodMongooseSchema(
  z
    .object({
      _id: mongooseZodCustomType('ObjectId').mongooseTypeOptions({
        _id: true,
        auto: true,
      }),
    })
    .merge(FundsRequestDataSchema)
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

export type FundsRequestDocumentType = InstanceType<typeof FundsRequest>;

export type FundsRequestDataType = z.infer<typeof FundsRequestDataSchema>;

export const FundsRequest = models?.FundsRequest
  ? (models.FundsRequest as pkg.Model<typeof fundsRequestMongooseSchema>)
  : mongoose.model<typeof fundsRequestMongooseSchema>(
      'FundsRequest',
      fundsRequestMongooseSchema
    );
