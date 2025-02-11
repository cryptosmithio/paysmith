/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import type { FundsRequestDocumentType } from '@/app/requestFunds/models';
import {
  createInvoiceInvoicesPost,
  createTokenTokenPost,
  rateCryptosRateGet,
} from '@/lib/bitcartApi';
import axios from 'axios';
import type { DisplayInvoice } from './bitcartApi/models';
import { CurrencyType } from './constants';
const permissions = ['full_control'];

const bcConfig = {
  storeId: process.env.BITCART_STORE_ID,
  email: process.env.BITCART_EMAIL,
  password: process.env.BITCART_PASSWORD,
  apiUrl: process.env.BITCART_API_URL,
};

const createBitcartToken = async () => {
  const email = bcConfig.email;
  const password = bcConfig.password;
  const apiURL = bcConfig.apiUrl;
  if (!email || !password || !apiURL) {
    throw new Error('Bitcart API credentials not found');
  }
  axios.defaults.baseURL = apiURL;

  const resp = await createTokenTokenPost({
    email,
    password,
    permissions,
  });

  if (!resp.data) throw new Error('No data returned from Bitcart API');

  const accessToken = (resp.data as any)['access_token'];
  if (!accessToken)
    throw new Error('No access token returned from Bitcart API');

  return accessToken as string;
};

const getHeaders = async () => {
  const token: string = await createBitcartToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export async function getEthRate() {
  const headers = await getHeaders();
  const response = await rateCryptosRateGet(
    {
      currency: CurrencyType.ETH,
      fiat_currency: CurrencyType.USD,
    },
    headers
  );
  const exchangeRate: number | undefined = Number(response?.data);
  return exchangeRate;
}

export const createInvoice = async (fr: FundsRequestDocumentType) => {
  const headers = await getHeaders();
  const response = await createInvoiceInvoicesPost(
    {
      price: fr.amount,
      currency: fr.currency,
      store_id: bcConfig.storeId!,
      expiration: Number(fr.linkExpiry),
      order_id: fr._id.toString(),
    },
    headers
  );

  if (!response || !response.data) {
    console.error('Invoice cannot be created');
    throw new Error('Invoice cannot be created');
  }
  const invoice = response.data as DisplayInvoice;
  return invoice;
};
