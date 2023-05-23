import { User } from '@workagora/utils';
import { useCallback, useEffect, useState } from 'react';
import { getRecentFreelancers } from '../services/search';

interface UseRecentFreelancerProps {
  limit: number;
}

export const useRecentFreelancer = ({ limit }: UseRecentFreelancerProps) => {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const callGet = useCallback(async () => {
    setLoading(true);
    const res = await getRecentFreelancers({ limit });
    setFreelancers(res);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    callGet();
  }, [callGet]);

  return { freelancers, loading };
};
