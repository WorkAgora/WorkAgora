import { FC } from 'react';
import GithubIcon from '../components/icons/social/GithubIcon';
import LinkedinIcon from '../components/icons/social/LinkedinIcon';
import LinkIcon from '../components/icons/social/LinkIcon';

export const useIconForLink = () => {
  const possibleIcon: { [key: string]: FC } = {
    linkedin: LinkedinIcon,
    github: GithubIcon
  };

  const getIcon = (url: string): FC => {
    let domain = url.replace(/^(https?:\/\/)?(www\.)?/i, '');

    const slashIndex = domain.indexOf('/');
    if (slashIndex !== -1) {
      domain = domain.substring(0, slashIndex);
    }

    const parts = domain.split('.');
    if (parts.length >= 2) {
      domain = parts[0];
    }

    if (domain) {
      return possibleIcon[domain] || LinkIcon;
    }
    return LinkIcon;
  };

  return { getIcon };
};
