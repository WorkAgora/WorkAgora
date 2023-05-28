import { createContext, ReactNode, useEffect, useState } from 'react';
import { useContext } from 'react';
import { CreateJob } from '@workagora/utils';

type JobsContextInterface = {
  jobs: CreateJob[] | null;
  setJobs: (jobs: CreateJob[] | null) => void;
  jobsFetching: boolean;
  setJobsFetching: (fetching: boolean) => void;
};

export const JobsContext = createContext<JobsContextInterface>({
  jobs: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setJobs: () => {},
  jobsFetching: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setJobsFetching: () => {}
});

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<CreateJob[] | null>(null);
  const [jobsFetching, setJobsFetching] = useState(false);

  return (
    <JobsContext.Provider value={{ jobs, setJobs, jobsFetching, setJobsFetching }}>
      {children}
    </JobsContext.Provider>
  );
};

export function useJobs() {
  const { jobs, setJobs, jobsFetching, setJobsFetching } = useContext(JobsContext);

  return { jobs, setJobs, jobsFetching, setJobsFetching };
}
