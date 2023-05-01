import { publicApi } from './api';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SignInWithEthereumProps {
  message: string;
  signature: string;
}

export interface SignUpWithEthereumProps extends SignInWithEthereumProps {
  wallet: `0x${string}`;
  email: string;
  firstname: string;
  lastname: string;
  userType: string;
  agreeTOS: boolean;
  agreeDataTreatment: boolean;
}

export type SignInWithEthereum = (props: SignInWithEthereumProps) => Promise<AuthTokens>;

export type SignUpWithEthereum = (props: SignUpWithEthereumProps) => Promise<boolean>;

export type GetNonceApi = (address: string) => Promise<string>;

export const getNonceApi: GetNonceApi = async (address) => {
  const response = await publicApi.post(`/auth/getNonce/${address}`);
  return response.data.nonce;
};

export const signInWithEthereumApi: SignInWithEthereum = async (payload) => {
  const response = await publicApi.post(`/auth/login`, payload);
  return response.data;
};

export const signUpWithEthereumApi: SignUpWithEthereum = async (payload) => {
  const response = await publicApi.post(`/auth/register`, payload);
  return response.data;
};
