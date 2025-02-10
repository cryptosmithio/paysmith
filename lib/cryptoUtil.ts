/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { createTokenTokenPost, rateCryptosRateGet } from '@/lib/bitcartApi';
import axios from 'axios';
import { CurrencyType } from './constants';
const permissions = ['full_control'];

export const createBitcartToken = async () => {
  const email = process.env.BITCART_EMAIL;
  const password = process.env.BITCART_PASSWORD;
  const apiURL = process.env.BITCART_API_URL;

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

export async function getEthRate() {
  const token: string = await createBitcartToken();

  const response = await rateCryptosRateGet(
    {
      currency: CurrencyType.ETH,
      fiat_currency: CurrencyType.USD,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  const exchangeRate: number | undefined = Number(response?.data);
  return exchangeRate;
}
