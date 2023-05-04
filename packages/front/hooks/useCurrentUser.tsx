import { CurrentUserContext } from '@workaurora/front-provider';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { useDisconnect } from 'wagmi';

export function useCurrentUser() {
  const { user, setUser } = useContext(CurrentUserContext);
  const { disconnect } = useDisconnect();

  const logout = () => {
    disconnect();
    //Timeout to prevent wallet asking for nonce again
    setTimeout(() => {
      Cookies.remove('authenticated');
      setUser(null);
    }, 200);
  };

  return { user, setUser, logout };
}
