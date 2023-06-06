/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, ReactNode, useContext, useState } from 'react';
import { UserTypeEnum } from '@workagora/utils';

export type ViewType = UserTypeEnum;

type LandingContextInterface = {
  type: ViewType;
  currentView: string;
  signupModalOpen: boolean;
  hasScroll: boolean;
  setType: (user: ViewType) => void;
  setCurrentView: (view: string) => void;
  setSignupModalOpen: (open: boolean) => void;
  setHasScroll: (hasScroll: boolean) => void;
};

export const LandingContext = createContext<LandingContextInterface>({
  type: UserTypeEnum.Freelancer,
  currentView: '',
  signupModalOpen: false,
  hasScroll: false,
  setType: () => {},
  setCurrentView: () => {},
  setSignupModalOpen: () => {},
  setHasScroll: () => {}
});

export const LandingProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ViewType>(UserTypeEnum.Freelancer);
  const [currentView, setCurrentView] = useState<string>('');
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [hasScroll, setHasScroll] = useState(false);

  return (
    <LandingContext.Provider
      value={{
        type,
        currentView,
        signupModalOpen,
        hasScroll,
        setType,
        setCurrentView,
        setSignupModalOpen,
        setHasScroll
      }}
    >
      {children}
    </LandingContext.Provider>
  );
};

export function useLanding() {
  const {
    type,
    currentView,
    signupModalOpen,
    hasScroll,
    setType,
    setCurrentView,
    setSignupModalOpen,
    setHasScroll
  } = useContext(LandingContext);

  const handleViewChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      setCurrentView(entry.target.id);
    }
  };

  const handleScroll = (el: HTMLElement) => {
    if (el.scrollTop === 0) {
      setHasScroll(false);
    } else {
      setHasScroll(true);
    }
  };

  return {
    type,
    currentView,
    signupModalOpen,
    hasScroll,
    setType,
    handleViewChange,
    setCurrentView,
    setSignupModalOpen,
    handleScroll,
    setHasScroll
  };
}
