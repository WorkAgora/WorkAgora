import { useCallback, useEffect, useState } from 'react';
import { getRecentFreelancers } from '../services/search';

export const useRecentFreelancer = () => {
  const [freelancers, setFreelancers] = useState<any[]>([]);

  const callGet = useCallback(async () => {
    const res = await getRecentFreelancers({ limit: 8 });
    setFreelancers(res);
  }, []);

  useEffect(() => {
    callGet();
  }, [callGet]);

  return { freelancers };
};
