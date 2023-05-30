import { createContext, ReactNode, useEffect, useState } from 'react';
import { useContext } from 'react';
import { CreateCompany } from '@workagora/utils';

type CurrentCompanyContextInterface = {
  company: CreateCompany | null;
  setCompany: (company: CreateCompany | null) => void;
  fetching: boolean;
  setFetching: (fetching: boolean) => void;
};

export const CurrentCompanyContext = createContext<CurrentCompanyContextInterface>({
  company: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCompany: () => {},
  fetching: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFetching: () => {}
});

export const CurrentCompanyProvider = ({ children }: { children: ReactNode }) => {
  const [company, setCompany] = useState<CreateCompany | null>(null);
  const [fetching, setFetching] = useState(false);

  return (
    <CurrentCompanyContext.Provider value={{ company, setCompany, fetching, setFetching }}>
      {children}
    </CurrentCompanyContext.Provider>
  );
};

export function useCurrentCompany() {
  const { company, setCompany, fetching, setFetching } = useContext(CurrentCompanyContext);

  return { company, setCompany, fetching, setFetching };
}
