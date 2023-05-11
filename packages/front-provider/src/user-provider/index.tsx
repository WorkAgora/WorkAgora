import { createContext, ReactNode, useState } from 'react';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { useDisconnect } from 'wagmi';
import { useRouter } from 'next/router';
import { privateApi } from '../api';
import { useLanding, ViewType } from '../landing-provider';
export interface User {
  wallet: string;
  email: string;
  currentUserType: ViewType;
  firstname: string;
  lastname: string;
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
    setCurUser(user);
    if (user) {
      Cookies.set('authenticated', 'true', {
        expires: 30,
        sameSite: 'Lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      });
      push('/dashboard');
    }
  };

  return (
    <CurrentUserContext.Provider value={{ user, setUser }}>{children}</CurrentUserContext.Provider>
  );
};

export function useCurrentUser() {
  const { user, setUser } = useContext(CurrentUserContext);
  const { disconnect } = useDisconnect();
  const { push } = useRouter();

  const logout = async () => {
    disconnect();
    await privateApi.get('/auth/logout');
    //Timeout to prevent wallet asking for nonce again
    push('/');
    setTimeout(() => {
      Cookies.remove('authenticated');
      setUser(null);
    }, 200);
  };

  return { user, setUser, logout };
}
