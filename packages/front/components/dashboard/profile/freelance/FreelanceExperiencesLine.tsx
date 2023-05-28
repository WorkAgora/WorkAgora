import { Experience } from '@workagora/utils';
import { FC } from 'react';

interface FreelanceExperiencesLineProps {
  experience: Experience;
}

const FreelanceExperiencesLine: FC<FreelanceExperiencesLineProps> = ({ experience }) => {
  return <>{JSON.stringify(experience)}</>;
};

export default FreelanceExperiencesLine;
