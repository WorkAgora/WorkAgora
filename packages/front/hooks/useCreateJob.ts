import { useCurrentCompany, useJobs } from '@workagora/front-provider';
import { CreateJob } from '@workagora/utils';
import { useCallback, useState } from 'react';
import { createJob } from '../services/jobs';

export const useCreateJob = () => {
  const [loading, setLoading] = useState(false);
  const { jobs, setJobs } = useJobs();
  const { company } = useCurrentCompany();

  const createNewJob = useCallback(
    async (job: Partial<CreateJob>) => {
      setLoading(true);
      const res = await createJob({ ...job, companyUuid: company?.uuid });
      if (jobs) {
        setJobs([...jobs, res]);
      } else {
        setJobs([res]);
      }
      setLoading(false);
    },
    [setJobs]
  );

  return { loading, createNewJob };
};
