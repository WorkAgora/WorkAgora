import { privateApi } from '@workagora/front-provider';
import { User, UserTypeEnum } from '@workagora/utils';

export type CheckUserLogged = () => Promise<User>;

export type ChangeUserType = (userType: UserTypeEnum) => Promise<User>;

export type UpdateUserProfile = (user: Partial<User>) => Promise<User>;

export const checkUserLogged: CheckUserLogged = async () => {
  const res = await privateApi.get('/user');
  return res.data;
};

export const changeUserType: ChangeUserType = async (userType) => {
  const res = await privateApi.put('/user/changeUserType', { userType: userType });
  return res.data;
};

export const updateUserProfile: UpdateUserProfile = async (user) => {
  const res = await privateApi.put('/user/updateProfile', {
    ...user
  });
  return res.data;
};
