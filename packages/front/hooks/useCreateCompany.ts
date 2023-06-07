import { useCurrentCompany } from '@workagora/front-provider';
import { Company } from '@workagora/utils';
import { useCallback, useState } from 'react';
import { createCompany } from '../services/company';

export const useCreateCompany = () => {
  const [loading, setLoading] = useState(false);
  const { setCompany } = useCurrentCompany();

  const createNewCompany = useCallback(
    async (company: Partial<Company>) => {
      setLoading(true);
      const res = await createCompany(company);
      setCompany(res);
      setLoading(false);
    },
    [setCompany]
  );

  return { loading, createNewCompany };
};
