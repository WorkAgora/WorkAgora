import { privateApi } from '@workagora/front-provider';

export const checkUserLogged = async () => {
  const res = await privateApi.get('/user');
  return res.data;
};
