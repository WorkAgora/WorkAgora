/* eslint-disable @typescript-eslint/no-empty-function */
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { CreateJob, UserTypeEnum } from '@workagora/utils';
import { searchFreelancers, searchFreelancersLogged, searchJobs } from '../services/search';
import { createContext, ReactNode, useContext, useState, useCallback, useEffect } from 'react';

type SearchJobContextInterface = {
  jobs: CreateJob[];
  setJobs: (users: CreateJob[]) => void;
  totalResult: number;
  setTotalResult: (result: number) => void;
  searchFilters: string[];
  setSearchFilters: (filters: string[]) => void;
  elementByPage: number;
  setElementByPage: (elementByPage: number) => void;
  maxPage: number;
  setMaxPage: (maxPage: number) => void;
  curPage: number;
  setCurPage: (curPage: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const SearchJobContext = createContext<SearchJobContextInterface>({
  jobs: [],
  setJobs: () => {},
  totalResult: 0,
  setTotalResult: () => {},
  searchFilters: [],
  setSearchFilters: () => {},
  elementByPage: 6,
  setElementByPage: () => {},
  maxPage: 1,
  setMaxPage: () => {},
  curPage: 1,
  setCurPage: () => {},
  loading: false,
  setLoading: () => {}
});

export const SearchJobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<CreateJob[]>([]);
  const [totalResult, setTotalResult] = useState(0);
  const [searchFilters, setSearchFilters] = useState<string[]>([]);
  const [elementByPage, setElementByPage] = useState(6);
  const [maxPage, setMaxPage] = useState(1);
  const [curPage, setCurPage] = useState(1);
  const [loading, setLoading] = useState(true);

  return (
    <SearchJobContext.Provider
      value={{
        jobs,
        totalResult,
        searchFilters,
        elementByPage,
        maxPage,
        curPage,
        loading,
        setJobs,
        setTotalResult,
        setSearchFilters,
        setElementByPage,
        setMaxPage,
        setCurPage,
        setLoading
      }}
    >
      {children}
    </SearchJobContext.Provider>
  );
};

export const useSearchJob = (elementToDisplay?: number) => {
  const {
    jobs,
    totalResult,
    searchFilters,
    elementByPage,
    maxPage,
    curPage,
    loading,
    setJobs,
    setTotalResult,
    setSearchFilters,
    setElementByPage,
    setMaxPage,
    setCurPage,
    setLoading
  } = useContext(SearchJobContext);
  const { user } = useCurrentUser();
  const { type } = useLanding();

  useEffect(() => {
    if (elementToDisplay) {
      setElementByPage(elementToDisplay);
    }
  }, [elementToDisplay, setElementByPage]);

  const callGet = useCallback(
    async (page: number, limit: number, searchTerm?: string) => {
      setLoading(true);
      let res = null;
      res = await searchJobs({ page, limit, searchTerm });
      if (res) {
        setCurPage(page);
        setJobs(res.jobs);
        setMaxPage(res.maxPage);
        setTotalResult(res.totalResult);
      }
      setLoading(false);
    },
    [setCurPage, setJobs, setLoading, setMaxPage, setTotalResult, user]
  );

  const handleSearch = useCallback(
    (page: number, elementByPage: number, filters: string[]) => {
      if (filters.length === 0) {
        callGet(page, elementByPage);
      }
      if (filters.length === 1) {
        callGet(page, elementByPage, filters[0]);
      }
      if (filters.length > 1) {
        callGet(page, elementByPage, filters.join(';'));
      }
    },
    [callGet]
  );

  useEffect(() => {
    if (searchFilters && type === UserTypeEnum.Freelancer) {
      handleSearch(1, elementByPage, searchFilters);
    }
  }, [handleSearch, searchFilters]);

  return {
    jobs,
    loading,
    maxPage,
    curPage,
    totalResult,
    searchFilters,
    setElementByPage,
    elementByPage,
    setSearchFilters,
    handleSearch
  };
};
