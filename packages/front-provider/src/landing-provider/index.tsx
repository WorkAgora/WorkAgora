/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, ReactNode, useContext, useState } from 'react';

const possibleType: string[] = ['freelance', 'company'];

export type ViewType = (typeof possibleType)[number];

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
  type: possibleType[0],
  currentView: '',
  signupModalOpen: false,
  hasScroll: false,
  setType: () => {},
  setCurrentView: () => {},
  setSignupModalOpen: () => {},
  setHasScroll: () => {}
});

export const LandingProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ViewType>(possibleType[0]);
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
    possibleType,
    currentView,
    signupModalOpen,
    hasScroll,
    setType,
    handleViewChange,
    setSignupModalOpen,
    handleScroll
  };
}
