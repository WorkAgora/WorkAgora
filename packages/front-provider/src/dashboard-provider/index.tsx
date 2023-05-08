/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, ReactNode, useContext, useState } from 'react';

type DashboardContextInterface = {
  view: string;
  setView: (view: string) => void;
};

export const DashboardContext = createContext<DashboardContextInterface>({
  view: 'dashboard',
  setView: () => {}
});

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [view, setView] = useState('dashboard');
  return (
    <DashboardContext.Provider value={{ view, setView }}>{children}</DashboardContext.Provider>
  );
};

export function useDashboard() {
  const { view, setView } = useContext(DashboardContext);

  return { view, setView };
}
