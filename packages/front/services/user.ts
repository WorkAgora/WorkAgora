import { privateApi } from './api';

export const checkUserLogged = async () => {
  const res = await privateApi.get('/user');
  return res.data;
};
