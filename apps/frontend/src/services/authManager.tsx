import { useAuthenticationSignIn, useAuthenticationVerifyTwoFactorCode } from '@/__generated__/endpoints/authentication.gen';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { authContext, IAuthContextProps } from './authcontext';
import { getUserActiveToken, isTokenExpired, USER_AUTH_TOKEN_STORAGE_KEY } from './authutils';

const IDLE_TIMEOUT = 60000 * 30;
const storeUserToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem(USER_AUTH_TOKEN_STORAGE_KEY);
  } else {
    localStorage.setItem(USER_AUTH_TOKEN_STORAGE_KEY, token);
  }
};

const useAuthManager = () => {
  const queryClient = useQueryClient();

  const [authToken, setAuthToken] = useState<string | null>(getUserActiveToken());
  const loggedIn = !!authToken;

  const clearUser = useCallback(() => {
    setAuthToken(null);
    storeUserToken(null);
  }, [setAuthToken]);

  const loginCallback = useAuthenticationSignIn();
  const otpLoginCallback = useAuthenticationVerifyTwoFactorCode();

  const login = useCallback(
    async ({
      email,
      password,
      onSuccess,
      onError,
    }: Parameters<IAuthContextProps["login"]>[0]) => {
      try {
        const response = await loginCallback.mutateAsync({
          data: { email, password },
        });
        onSuccess(response.email);
      } catch (err) {
        onError(JSON.stringify(err));
      }
    }, [loginCallback]
  );

  const otpLogin = useCallback(
    async ({
      email,
      otp,
      onSuccess,
      onError,
    }: Parameters<IAuthContextProps["otpLogin"]>[0]) => {
      try {
        const response = await otpLoginCallback.mutateAsync({
          data: { email, otp }
        });
        if (response.status === "active" ||
          response.status === "onboarding"
        ) {
          storeUserToken(response.access_token);
          setAuthToken(response.access_token);
        } else {
          clearUser();
        }
        onSuccess({
          authToken: response.access_token,
          status: response.status,
        });
      } catch (err) {
        onError(JSON.stringify(err));
      }
    }, [otpLoginCallback, clearUser]
  );

  const logout = useCallback(() => {
    clearUser();
    queryClient.clear();
    window.location.href = '/';
  }, [
    clearUser,
    queryClient,
  ]);

  const removeToken = useCallback(() => {
    clearUser();
    queryClient.clear();
  }, [clearUser, queryClient]);

  useIdleTimer({
    onIdle: () => {
      if (loggedIn) logout();
    },
    timeout: IDLE_TIMEOUT,
    throttle: 500,
    crossTab: true,
    syncTimers: 200,
  });

  if (authToken && isTokenExpired(authToken)) {
    logout();
  }
  return {
    authToken,
    loggedIn,
    login,
    logout,
    removeToken,
    otpLogin,
  };
};

export const AuthManagerWrapper = ({ children }: { children: React.ReactNode; }) => {
  const authManager = useAuthManager();
  return <authContext.Provider value={authManager}>{children}</authContext.Provider>;
};
