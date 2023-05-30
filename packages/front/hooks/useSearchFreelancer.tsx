/* eslint-disable @typescript-eslint/no-empty-function */
import { useCurrentUser, useLanding } from '@workagora/front-provider';
import { User, UserTypeEnum } from '@workagora/utils';
import { searchFreelancers, searchFreelancersLogged } from '../services/search';
import { createContext, ReactNode, useContext, useState, useCallback, useEffect } from 'react';

type SearchFreelancersContextInterface = {
  freelancers: User[];
  setFreelancers: (users: User[]) => void;
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

export const SearchFreelancerContext = createContext<SearchFreelancersContextInterface>({
  freelancers: [],
  setFreelancers: () => {},
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

export const SearchFreelancerProvider = ({ children }: { children: ReactNode }) => {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [totalResult, setTotalResult] = useState(0);
  const [searchFilters, setSearchFilters] = useState<string[]>([]);
  const [elementByPage, setElementByPage] = useState(6);
  const [maxPage, setMaxPage] = useState(1);
  const [curPage, setCurPage] = useState(1);
  const [loading, setLoading] = useState(true);

  return (
    <SearchFreelancerContext.Provider
      value={{
        freelancers,
        totalResult,
        searchFilters,
        elementByPage,
        maxPage,
        curPage,
        loading,
        setFreelancers,
        setTotalResult,
        setSearchFilters,
        setElementByPage,
        setMaxPage,
        setCurPage,
        setLoading
      }}
    >
      {children}
    </SearchFreelancerContext.Provider>
  );
};

export const useSearchFreelancer = (elementToDisplay?: number) => {
  const {
    freelancers,
    totalResult,
    searchFilters,
    elementByPage,
    maxPage,
    curPage,
    loading,
    setFreelancers,
    setTotalResult,
    setSearchFilters,
    setElementByPage,
    setMaxPage,
    setCurPage,
    setLoading
  } = useContext(SearchFreelancerContext);
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
      if (!user) {
        res = await searchFreelancers({ page, limit, searchTerm });
      } else {
        res = await searchFreelancersLogged({ page, limit, searchTerm });
      }
      if (res) {
        setCurPage(page);
        setFreelancers(res.users);
        setMaxPage(res.maxPage);
        setTotalResult(res.totalResult);
      }
      setLoading(false);
    },
    [setCurPage, setFreelancers, setLoading, setMaxPage, setTotalResult, user]
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
    if (searchFilters && type === UserTypeEnum.Company) {
      handleSearch(1, elementByPage, searchFilters);
    }
  }, [handleSearch, searchFilters]);

  return {
    freelancers,
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
