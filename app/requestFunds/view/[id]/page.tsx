import { FundsRequest, type FundsRequestType } from '@/app/requestFunds/models';
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
  const fundsRequest = await FundsRequest.findById(id);
  const fr = JSON.parse(JSON.stringify(fundsRequest)) as FundsRequestType;
  return <ViewRequest fundsRequest={fr} />;
}
// Compare this snippet from lib/dbConnect.ts:
