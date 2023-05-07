import { createContext, ReactNode, useState } from 'react';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import { privateApi } from '../api';
export interface User {
  wallet: string;
  email: string;
}

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
  const [user, setCurUser] = useState<User | null>(null);
  const { push } = useRouter();

  const setUser = (user: User | null) => {
    if (user) {
      Cookies.set('authenticated', 'true', {
        expires: 30,
        sameSite: 'Lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      });
    }
    setCurUser(user);
    push('/dashboard');
  };

  return (
    <CurrentUserContext.Provider value={{ user, setUser }}>{children}</CurrentUserContext.Provider>
  );
};

export function useCurrentUser() {
  const { user, setUser } = useContext(CurrentUserContext);
  const { disconnect } = useDisconnect();

  const logout = async () => {
    disconnect();
    await privateApi.get('/auth/logout');
    //Timeout to prevent wallet asking for nonce again
    setTimeout(() => {
      Cookies.remove('authenticated');
      setUser(null);
    }, 200);
  };

  return { user, setUser, logout };
}
