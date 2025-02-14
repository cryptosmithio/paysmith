import ViewRequest from '../../../components/ViewRequest';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ViewRequest id={id} />;
}
