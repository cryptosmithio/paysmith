import {
  FundsRequest,
  type FundsRequestDataType,
} from '@/app/requestFunds/models';
import dbConnect from '@/lib/dbConnect';
import ViewRequest from './ViewRequest';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load request from database
  await dbConnect();
  const fundsRequest = (await FundsRequest.findById(
    id
  )) as FundsRequestDataType;

  return <ViewRequest fundsRequest={fundsRequest} />;
}
