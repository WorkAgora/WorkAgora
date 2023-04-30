import { publicApi } from './api';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type SignInWithEthereumProps = {
  message: string;
  signature: string;
};

export type SignInWithEthereum = (props: SignInWithEthereumProps) => Promise<AuthTokens>;

export type GetNonceApi = (address: string) => Promise<string>;

export const getNonceApi: GetNonceApi = async (address) => {
  const response = await publicApi.post(`/auth/getNonce/${address}`);
  return response.data.nonce;
};

export const signInWithEthereumApi: SignInWithEthereum = async (payload) => {
  const response = await publicApi.post(`/auth/login`, payload);
  return response.data;
};
