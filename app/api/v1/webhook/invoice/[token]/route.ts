import { FundsRequest } from '@/app/requestFunds/models';
import { FundsRequestStatus } from '@/app/requestFunds/schemas';
import { BCInvoiceStatus } from '@/lib/constants';
import { authDecrypt } from '@/lib/server/crypt';
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
    const status = jsonData.status as BCInvoiceStatus;

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

    // Find the funds request based on the invoice ID
    const fundsRequest = await FundsRequest.findOne({ bcInvoiceId });
    if (!fundsRequest) {
      console.error('Funds request not found for invoice:', bcInvoiceId);
      return new Response(undefined, { status: 200 });
    }

    // Update the funds request status based on the invoice status
    switch (status) {
      case BCInvoiceStatus.COMPLETE:
        fundsRequest.status = FundsRequestStatus.COMPLETED;
        await fundsRequest.save();
        break;
      case BCInvoiceStatus.EXPIRED:
        fundsRequest.status = FundsRequestStatus.EXPIRED;
        await fundsRequest.save();
        break;
      case BCInvoiceStatus.FAILED:
      case BCInvoiceStatus.REFUNDED:
      case BCInvoiceStatus.INVALID:
      default:
        break;
    }
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
