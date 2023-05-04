import { createContext, ReactNode, useContext, useState } from 'react';

const possibleType: string[] = ['Freelance', 'Company'];

type ViewType = (typeof possibleType)[number];

type LandingContextInterface = {
  type: ViewType;
  currentView: string;
  signupModalOpen: boolean;
  setType: (user: ViewType) => void;
  setCurrentView: (view: string) => void;
  setSignupModalOpen: (open: boolean) => void;
};

export const LandingContext = createContext<LandingContextInterface>({
  type: possibleType[0],
  currentView: '',
  signupModalOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setType: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentView: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setSignupModalOpen: () => {}
});

export const LandingProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ViewType>(possibleType[0]);
  const [currentView, setCurrentView] = useState<string>('');
  const [signupModalOpen, setSignupModalOpen] = useState(false);

  return (
    <LandingContext.Provider
      value={{ type, setType, currentView, setCurrentView, signupModalOpen, setSignupModalOpen }}
    >
      {children}
    </LandingContext.Provider>
  );
};

export function useLanding() {
  const { type, setType, currentView, setCurrentView, signupModalOpen, setSignupModalOpen } =
    useContext(LandingContext);

  const handleViewChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    if (inView) {
      setCurrentView(entry.target.id);
    }
  };

  return {
    type,
    setType,
    possibleType,
    currentView,
    handleViewChange,
    signupModalOpen,
    setSignupModalOpen
  };
}
