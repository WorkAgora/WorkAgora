import { createContext, ReactNode, useContext, useState } from 'react';

const possibleType: string[] = ['Freelance', 'Company'];

type ViewType = (typeof possibleType)[number];

type LandingContextInterface = {
  type: ViewType;
  currentView: string;
  setType: (user: ViewType) => void;
  setCurrentView: (view: string) => void;
};

export const LandingContext = createContext<LandingContextInterface>({
  type: possibleType[0],
  currentView: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setType: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentView: () => {}
});

export const LandingProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ViewType>(possibleType[0]);
  const [currentView, setCurrentView] = useState<string>('');

  return (
    <LandingContext.Provider value={{ type, setType, currentView, setCurrentView }}>
      {children}
    </LandingContext.Provider>
  );
};

export function useLanding() {
  const { type, setType, currentView, setCurrentView } = useContext(LandingContext);
  const handleViewChange = (inView: boolean, entry: IntersectionObserverEntry) => {
    console.log(inView);
    console.log(entry);
    if (inView) {
      setCurrentView(entry.target.id);
    }
  };

  return { type, setType, possibleType, currentView, handleViewChange };
}
