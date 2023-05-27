import { privateApi } from '@workagora/front-provider';
import { User, UserTypeEnum, Experience } from '@workagora/utils';

export type CheckUserLogged = () => Promise<User>;

export type ChangeUserType = (userType: UserTypeEnum) => Promise<User>;

export type UpdateUserProfile = (user: Partial<User>) => Promise<User>;

export type GetUserProfile = (wallet: string) => Promise<User>;

export type AddExperience = (experience: Omit<Experience, 'id'>) => Promise<User>;

export type DeleteExperience = (id: string) => Promise<User>;

export type UpdateExperience = (experience: Experience) => Promise<User>;

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

export const getUserProfile: GetUserProfile = async (wallet) => {
  const res = await privateApi.get(`/user/${wallet}`);
  return res.data;
};

export const addExperience: AddExperience = async (experience) => {
  const res = await privateApi.put('/user/experiences/add', {
    ...experience
  });
  return res.data;
};

export const deleteExperience: DeleteExperience = async (id) => {
  const res = await privateApi.delete('/user/experiences/delete', { data: { id } });
  return res.data;
};

export const updateExperience: UpdateExperience = async (experience) => {
  const res = await privateApi.patch('/user/experiences/update', { ...experience });
  return res.data;
};
