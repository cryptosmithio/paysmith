/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Process the webhook payload
    const { token } = await params;
    const jsonData = await request.json();
    const bcInvoiceId = jsonData.id as string;
    const status = jsonData.status as string;

    console.log('Webhook received:', {
      token,
      bcInvoiceId,
      status,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
  return new Response('Success!', {
    status: 200,
  });
}
