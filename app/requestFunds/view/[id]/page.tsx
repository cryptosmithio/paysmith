import ViewRequest from './ViewRequest';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Load request from database

  return <ViewRequest id={id} />;
}
