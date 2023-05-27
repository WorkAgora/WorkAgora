import { useCurrentUser } from '@workagora/front-provider';
import { Experience, User } from '@workagora/utils';
import { useCallback, useState } from 'react';
import { addExperience, deleteExperience, updateExperience } from '../services/user';

export const useExperiences = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useCurrentUser();

  const callAddExperience = useCallback(
    async (experience: Omit<Experience, 'id'>) => {
      setLoading(true);
      const res = await addExperience(experience);
      setUser(res);
      setLoading(false);
    },
    [setUser]
  );

  const callDeleteExperience = useCallback(
    async (id: string) => {
      setLoading(true);
      const res = await deleteExperience(id);
      setUser(res);
      setLoading(false);
    },
    [setUser]
  );

  const callUpdateExperience = useCallback(
    async (experience: Experience) => {
      setLoading(true);
      const res = await updateExperience(experience);
      setUser(res);
      setLoading(false);
    },
    [setUser]
  );

  return { loading, callAddExperience, callDeleteExperience, callUpdateExperience };
};
