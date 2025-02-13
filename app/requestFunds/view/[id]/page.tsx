import { getFundsRequestById } from '../../actions';
import ViewRequest from './ViewRequest';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load request from database
  const fundsRequest = await getFundsRequestById(id);
  return <ViewRequest fundsRequest={fundsRequest} id={id} />;
}
