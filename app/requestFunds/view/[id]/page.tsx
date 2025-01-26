import dbConnect from '@/lib/dbConnect';
import { FundsRequest, type FundsRequestDocumentType } from '../../models';
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
  )) as FundsRequestDocumentType;

  return <ViewRequest fundsRequest={fundsRequest} />;
}
