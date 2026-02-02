const Auth = {
  _accessKey: 'ACCESS_TOKEN',
_refreshKey: 'REFRESH_TOKEN',
  _currentUserKey: 'CURRENT_USER',
  
  try {
    // Code that may throw an error
  } catch (error) {
    console.error('An error occurred:', error);
  }

  get accessToken() {
    return localStorage.getItem(Auth._accessKey);
  },

  set accessToken(token) {
    localStorage.setItem(Auth._accessKey, token);
  },

  clearAccessToken() {
    localStorage.clear(Auth._accessKey);
  },

  get refreshToken() {
    return localStorage.getItem(Auth._refreshKey);
  },

  set refreshToken(token) {
    localStorage.setItem(Auth._refreshKey, token);
  },

  clearRefreshToken() {
    localStorage.clear(Auth._refreshKey);
  },

  get currentUser() {
    const userString = localStorage.getItem(Auth._currentUserKey);
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  },

  set currentUser(user) {
    localStorage.setItem(Auth._currentUserKey, JSON.stringify(user));
  },

  clearCurrentUser() {
    localStorage.clear(Auth._currentUserKey);
  },

  clearParams() {
    localStorage.removeItem('careRequestsDetailsViewParams');
  },

  logout: () => {
    Auth.clearAccessToken();
    Auth.clearRefreshToken();
    Auth.clearCurrentUser();
    Auth.clearParams();
  },
};

export default Auth;
