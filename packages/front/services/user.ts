import { privateApi } from '@workagora/front-provider';
import { UserTypeEnum } from '@workagora/utils';

export const checkUserLogged = async () => {
  const res = await privateApi.get('/user');
  return res.data;
};

export const changeUserType = async (userType: UserTypeEnum) => {
  const res = await privateApi.put('/user/changeUserType', { userType: userType });
  return res.data;
};
