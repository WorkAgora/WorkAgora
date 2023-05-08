import { privateApi, ViewType } from '@workagora/front-provider';

export const checkUserLogged = async () => {
  const res = await privateApi.get('/user');
  return res.data;
};

export const changeUserType = async (userType: ViewType) => {
  const res = await privateApi.put('/user/changeUserType', { userType: userType.toLowerCase() });
  return res.data;
};
