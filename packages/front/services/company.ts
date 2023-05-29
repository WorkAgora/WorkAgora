import { privateApi } from '@workagora/front-provider';
import { CreateCompany } from '@workagora/utils';
import { omit } from 'lodash';

export type CreateNewCompany = (company: Partial<CreateCompany>) => Promise<CreateCompany>;

export type GetMyCompanies = () => Promise<CreateCompany | null>;

export type UpdateCompany = (company: Partial<CreateCompany>) => Promise<CreateCompany>;

export type GetCompanyByUUID = (uuid: string) => Promise<CreateCompany | null>;

export const createCompany: CreateNewCompany = async (company) => {
  const res = await privateApi.post('/company/create', { ...company });
  return res.data;
};

export const updateCompany: UpdateCompany = async (company) => {
  const res = await privateApi.put(`/company/${company.uuid}`, {
    ...omit(company, ['uuid', 'companyWallet', 'createdAt'])
  });
  return res.data;
};

export const getMyCompanies: GetMyCompanies = async () => {
  const res = await privateApi.get('/company/my-companies');
  if (res.data) {
    if (res.data.length > 0) {
      return res.data[0];
    }
  }
  return null;
};

export const getCompanyByUUID: GetCompanyByUUID = async (uuid) => {
  const res = await privateApi.get(`/company/${uuid}`);
  return res.data;
};
