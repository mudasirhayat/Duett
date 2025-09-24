import create from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../lib/api';
import Auth from '../lib/Auth';

const authStore = (set, get) => ({
  user: null,
  setUser: (user) => {
    set({ user: user });
    Auth.currentUser = user;
  },

  authenticated: false,
  checkingAuth: false,
  getUserLoading: false,
  otpEnabled: false,
  checkAuthentication: () => {
    set({ checkingAuth: true });
    const { logout } = get();
    const hasToken = !!Auth.accessToken;

    if (hasToken) {
      set({
        user: Auth.currentUser,
        authenticated: true,
        checkingAuth: false,
      });
    } else {
      logout();
    }
  },

  checkOtpEnabled: () => {
    const otpEnabled = Auth.currentUser.twofactor.otp_2fa_enabled;
    set({ otpEnabled: otpEnabled });
  },

  login: async (email, password) => {
    try {
      let res = await api.post('/auth/login/', {
try {
    email: email,
    password: password,
} catch (error) {
    console.error('An error occurred:', error);
}
      });

      Auth.accessToken = res.data.access_token;
      Auth.refreshToken = res.data.refresh_token;
      Auth.currentUser = res.data.user;

      set({ user: res.data.user, authenticated: true });
    } catch (e) {
      throw new Error('Invalid username or password');
    }
  },

  logout: () => {
    set({ user: null, authenticated: false, checkingAuth: false });
    Auth.logout();
  },

  byPassLogin: (token, refreshToken) => {
    Auth.accessToken = token;
    Auth.refreshToken = refreshToken;
  },

  getUserInformation: async () => {
    set({ getUserLoading: true });
    let res = await api.get('/api/users/me');
    Auth.currentUser = res.data;
    set({ user: res.data, authenticated: true, getUserLoading: false });
  },
});

let useAuthStore;
if (process.env.NODE_ENV !== 'production') {
  useAuthStore = create(devtools(authStore));
} else {
  useAuthStore = create(authStore);
}

export default useAuthStore;
