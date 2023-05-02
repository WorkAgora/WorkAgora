import { createContext, useContext, ReactNode, useState } from 'react';
import { useDisconnect } from 'wagmi';
import { User } from '../services/auth';

type CurrentUserContextInterface = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const CurrentUserContext = createContext<CurrentUserContextInterface>({
  user: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {}
});

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <CurrentUserContext.Provider value={{ user, setUser }}>{children}</CurrentUserContext.Provider>
  );
};

export function useCurrentUser() {
  const { user, setUser } = useContext(CurrentUserContext);
  const { disconnect } = useDisconnect();
  //@TODO add a useEffect to refetch on first display

  const logout = () => {
    disconnect();
    //Timeout to prevent wallet asking for nonce again
    setTimeout(() => {
      setUser(null);
    }, 200);
  };

  return { user, logout };
}
