import { createContext, ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

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
  };

  return (
    <CurrentUserContext.Provider value={{ user, setUser }}>{children}</CurrentUserContext.Provider>
  );
};
