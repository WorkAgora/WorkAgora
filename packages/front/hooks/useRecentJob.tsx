import { useLanding } from '@workagora/front-provider';
import { CreateJob, UserTypeEnum } from '@workagora/utils';
import { useCallback, useEffect, useState } from 'react';
import { getRecentJobs } from '../services/search';

interface UseRecentJobProps {
  limit: number;
}

export const useRecentJob = ({ limit }: UseRecentJobProps) => {
  const [jobs, setJobs] = useState<CreateJob[]>([]);
  const [loading, setLoading] = useState(true);
  const { type } = useLanding();

  const callGet = useCallback(async () => {
    setLoading(true);
    const res = await getRecentJobs({ limit });
    console.log(res);
    setJobs(res);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    if (type === UserTypeEnum.Freelancer) {
      callGet();
    }
  }, [callGet, type]);

  return { jobs, loading };
};
