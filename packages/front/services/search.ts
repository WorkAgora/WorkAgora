import { privateApi, publicApi } from '@workagora/front-provider';
import { CreateJob, User } from '@workagora/utils';

export interface GetRecentFreelancersProps {
  limit: number;
}

export interface GetRecentJobsProps {
  limit: number;
}

export interface SearchJobsProps {
  limit: number;
  page: number;
  searchTerm?: string;
}
export interface SearchFreelancersProps {
  limit: number;
  page: number;
  searchTerm?: string;
}

export type GetRecentFreelancers = (props: GetRecentFreelancersProps) => Promise<User[]>;

export type SearchFreelancers = (
  props: SearchFreelancersProps
) => Promise<{ users: User[]; maxPage: number; totalResult: number }>;

export type SearchJobs = (
  props: SearchJobsProps
) => Promise<{ jobs: CreateJob[]; maxPage: number; totalResult: number }>;

export type GetRecentJobs = (props: GetRecentJobsProps) => Promise<CreateJob[]>;

export const getRecentFreelancers: GetRecentFreelancers = async ({ limit }) => {
  const res = await publicApi.get(`/user/recentFreelancer/${limit}`);
  return res.data;
};

export const getRecentJobs: GetRecentJobs = async ({ limit }) => {
  const res = await publicApi.get(`/jobs/recent/1/${limit}`);
  return res.data.jobs;
};

export const searchFreelancers: SearchFreelancers = async ({ limit, page, searchTerm }) => {
  let query = `/user/searchFreelancer/${page}/${limit}`;
  if (searchTerm) {
    query = `${query}?searchTerm=${searchTerm}`;
  }
  const res = await publicApi.get(query);
  return res.data;
};

export const searchJobs: SearchJobs = async ({ limit, page, searchTerm }) => {
  let query = `/jobs/search/${page}/${limit}`;
  if (searchTerm) {
    query = `${query}?searchTerm=${searchTerm}`;
  }
  const res = await publicApi.get(query);
  return res.data;
};

export const searchFreelancersLogged: SearchFreelancers = async ({ limit, page, searchTerm }) => {
  let query = `/user/searchFreelancerLogged/${page}/${limit}`;
  if (searchTerm) {
    query = `${query}?searchTerm=${searchTerm}`;
  }
  const res = await privateApi.get(query);
  return res.data;
};
