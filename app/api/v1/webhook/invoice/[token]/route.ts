import { authDecrypt } from '@/lib/crypt';
import { env } from 'node:process';

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Process the webhook payload
    const { token: encryptedToken } = await params;
    const jsonData = await request.json();
    const bcInvoiceId = jsonData.id as string;
    const status = jsonData.status as string;

    const token = encryptedToken
      ? (authDecrypt(encryptedToken, env.AUTH_SALT ?? '') as string)
      : undefined;

    if (!token || token !== bcInvoiceId) {
      console.error('Invalid token for invoice notification');
      return new Response(undefined, { status: 200 });
    }

    if (!bcInvoiceId || !status) {
      console.error('Missing bcInvoiceId or status');
      return new Response(undefined, { status: 400 });
    }

    console.log('Webhook received:', {
      token,
      bcInvoiceId,
      status,
    });

    // Update the funds request status based on the invoice status
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
