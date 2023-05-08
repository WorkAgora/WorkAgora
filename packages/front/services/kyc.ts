import { privateApi } from '@workagora/front-provider';

export const checkKycStatus = async () => {
  try {
    const res = await privateApi.get('/kyc/status');
    return res.data;
  } catch (e: any) {
    if (e.response.status === 403) {
      return null;
    }
  }
};

export const getKycSession = async () => {
  const res = await privateApi.get('/kyc/initiate');
  return res.data;
};
