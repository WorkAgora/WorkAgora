import { Company } from '@workagora/utils';
import { useCallback, useState } from 'react';
import { getCompanyByUUID } from '../services/company';

export const useGetCompanyById = () => {
  const [loading, setLoading] = useState(false);
  const [curCompany, setCurCompany] = useState<Company | null>(null);

  const getCompanyById = useCallback(async (uuid: string) => {
    if (!loading) {
      setLoading(true);
      const res = await getCompanyByUUID(uuid);
      setCurCompany(res);
      setLoading(false);
    }
  }, []);

  return { curCompany, getCompanyById, loading };
};
