import { useCurrentUser } from '@workagora/front-provider';
import { User } from '@workagora/utils';
import { useCallback, useState } from 'react';
import { searchFreelancers, searchFreelancersLogged } from '../services/search';

export const useSearchFreelancer = () => {
  const [freelancers, setFreelancers] = useState<User[]>([]);
  const [totalResult, setTotalResult] = useState(0);
  const [maxPage, setMaxPage] = useState(1);
  const [curPage, setCurPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useCurrentUser();

  const callGet = useCallback(async (page: number, limit: number, searchTerm?: string) => {
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
  }, []);

  return { freelancers, loading, maxPage, curPage, totalResult, callGet };
};
