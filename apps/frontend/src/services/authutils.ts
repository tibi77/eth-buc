export const USER_AUTH_TOKEN_STORAGE_KEY = 'metavest.user.auth_token';
export const getExp = (token: string) => JSON.parse(atob(token.split('.')[1])).exp * 1000;
export const isTokenExpired = (token: string) => Date.now() >= getExp(token);
export const timeTillExp = (token: string) => getExp(token) - Date.now();


export const getUserActiveToken = () => {
    const token = localStorage.getItem(USER_AUTH_TOKEN_STORAGE_KEY);
    if (token && !isTokenExpired(token)) return token;
    return null;
};

export const isAuthenticated = () => !!getUserActiveToken();
