import { User } from '@workagora/utils';
import { useCallback, useEffect, useState } from 'react';
import { getUserProfile } from '../services/user';

export const useGetUserProfile = () => {
  const [curUser, setCurUser] = useState<User>();
  const [loading, setLoading] = useState(false);

  const getProfile = useCallback(async (wallet: string) => {
    setLoading(true);
    const res = await getUserProfile(wallet);
    setCurUser(res);
    setLoading(false);
  }, []);

  return { loading, curUser, getProfile };
};
