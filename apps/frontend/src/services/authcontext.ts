import { TStatus } from '@bookIt/types/user';
import { createContext } from 'react';

export interface IAuthContextProps {
  authToken: string | null;
  loggedIn: boolean;
  login: ({
    email,
    password,
    onSuccess,
    onError,
  }: {
    email: string;
    password: string;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
  }) => void;
  otpLogin: ({
    email,
    otp,
    onSuccess,
    onError,
  }: {
    email: string;
    otp: string;
    onSuccess: ({
      authToken,
      status,
    }: {
      authToken: string;
      status: TStatus;
    }) => void;
    onError: (message: string) => void;
  }) => void;
  logout: (callback?: () => void) => void;
  removeToken: () => void;
}

export const authContext = createContext<IAuthContextProps>({
  authToken: null,
  loggedIn: false,
  login: () => {
    console.error('login not implemented');
  },
  otpLogin: () => {
    console.error('otpLogin not implemented');
  },
  logout: () => {
    console.error('logout not implemented');
  },
});
