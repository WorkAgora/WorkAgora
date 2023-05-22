import { publicApi } from '@workagora/front-provider';

export interface GetRecentFreelancersProps {
  limit: number;
}

export type GetRecentFreelancers = (props: GetRecentFreelancersProps) => Promise<any[]>;

export const getRecentFreelancers: GetRecentFreelancers = async ({ limit }) => {
  const res = await publicApi.get(`/user/recentFreelancer/${limit}`);
  return res.data;
};
