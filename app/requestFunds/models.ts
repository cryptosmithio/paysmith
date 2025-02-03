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

const fundsRequestSchema = toZodMongooseSchema(
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

const fundsRequestMongooseSchema = toMongooseSchema(fundsRequestSchema);

export type FundsRequestDocument = InstanceType<typeof FundsRequest>;

export type FundsRequestDocumentType = z.infer<typeof fundsRequestSchema>;

export const FundsRequest = models?.FundsRequest
  ? (models.FundsRequest as pkg.Model<FundsRequestDocumentType>)
  : mongoose.model<FundsRequestDocumentType>(
      'FundsRequest',
      fundsRequestMongooseSchema
    );
