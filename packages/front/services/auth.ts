import { User } from '@workagora/front-provider';
import { privateApi, publicApi } from '@workagora/front-provider';

export interface SignInWithEthereumProps {
  wallet: string;
  message: string;
  signature: string;
}

export interface SignUpWithEthereumProps extends SignInWithEthereumProps {
  wallet: `0x${string}`;
  email: string;
  firstname: string;
  lastname: string;
  currentUserType: string;
  agreeTOS: boolean;
  agreeDataTreatment: boolean;
}

export type SignInWithEthereum = (props: SignInWithEthereumProps) => Promise<User>;

export type SignUpWithEthereum = (props: SignUpWithEthereumProps) => Promise<boolean>;

export type GetNonceApi = (address: string) => Promise<string>;

export type GetRefreshToken = () => Promise<string>;

export const getNonceApi: GetNonceApi = async (address) => {
  const response = await publicApi.post(`/auth/getNonce/${address}`);
  return response.data.nonce;
};

export const signInWithEthereumApi: SignInWithEthereum = async (payload) => {
  const response = await publicApi.post(`/auth/login`, payload, { withCredentials: true });
  return response.data;
};

export const signUpWithEthereumApi: SignUpWithEthereum = async (payload) => {
  const response = await publicApi.post(`/auth/register`, payload);
  return response.data;
};

export const getRefreshToken: GetRefreshToken = async () => {
  const response = await privateApi.get('/auth/refresh');
  return response.data;
};
