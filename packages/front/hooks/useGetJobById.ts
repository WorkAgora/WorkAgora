import { CreateJob } from '@workagora/utils';
import { useCallback, useState } from 'react';
import { getJobByUUID } from '../services/jobs';

export const useGetJobById = () => {
  const [loading, setLoading] = useState(false);
  const [curJob, setCurJob] = useState<CreateJob | null>(null);

  const getJobById = useCallback(async (uuid: string) => {
    if (!loading) {
      setLoading(true);
      const res = await getJobByUUID(uuid);
      setCurJob(res);
      setLoading(false);
    }
  }, []);

  return { curJob, getJobById, loading };
};
