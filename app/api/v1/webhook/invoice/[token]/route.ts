/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Process the webhook payload
    const { token } = await params;
    const formData = await request.formData();
    const bcInvoiceId = formData.get('id') as string;
    const status = formData.get('status') as string;

    console.log('Webhook received:', {
      token,
      bcInvoiceId,
      status,
    });
  } catch (error: any) {
    return new Response(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }
  return new Response('Success!', {
    status: 200,
  });
}
