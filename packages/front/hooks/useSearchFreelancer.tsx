import { User } from '@workagora/utils';
import { useCallback, useState } from 'react';
import { searchFreelancers } from '../services/search';

export const useSearchFreelancer = () => {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [totalResult, setTotalResult] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const [curPage, setCurPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const callGet = useCallback(async (page: number, limit: number, searchTerm?: string) => {
    setLoading(true);
    const res = await searchFreelancers({ page, limit, searchTerm });
    setCurPage(page);
    setFreelancers(res.users);
    setMaxPage(res.maxPage);
    setTotalResult(res.totalResult);
    setLoading(false);
  }, []);

  return { freelancers, loading, maxPage, curPage, totalResult, callGet };
};