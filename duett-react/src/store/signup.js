import create from 'zustand';
import { devtools } from 'zustand/middleware';

const signupStore = (set) => ({
  profileData: {}, // Store profile data
  fundingSources: [], // Store funding sources
  services: [], // Store services
  counties: [], // Store counties
  documents: [], // Store uploaded documents
  authToken: '', // Store access token
  refreshToken: '', // Store refresh token
  userId: '', // Store user ID
  documentStatus: '', // Store the overall status of document approval (Approved, Rejected, Pending)

  // Actions to set data
  setProfileData: (data) => set({ profileData: data }),
  setFundingSources: (sources) => set({ fundingSources: sources }),
  setServices: (services) => set({ services: services }),
  setCounties: (counties) => set({ counties: counties }),
  setDocuments: (documents) => set({ documents: documents }),

  // Actions to set tokens and user ID, including saving them to localStorage
  setAuthToken: (token) => {
    set({ authToken: token });
    localStorage.setItem('accessToken', token); // Store access token in localStorage
  },
  setRefreshToken: (token) => {
    set({ refreshToken: token });
    localStorage.setItem('refreshToken', token); // Store refresh token in localStorage
  },
  setUserId: (id) => {
    set({ userId: id });
    localStorage.setItem('userId', id); // Store user ID in localStorage
  },

  // Action to set document status
  setDocumentStatus: (status) => set({ documentStatus: status }),

  // Reset the entire signup state
  resetSignupState: () =>
    set({
      profileData: {},
      fundingSources: [],
      services: [],
      counties: [],
      documents: [],
      authToken: '',
      refreshToken: '',
      userId: '',
      documentStatus: '', // Reset document status
    }),

  // Load tokens from localStorage into Zustand state
  loadTokensFromStorage: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');

    if (accessToken) {
      set({ authToken: accessToken });
    }
    if (refreshToken) {
      set({ refreshToken: refreshToken });
    }
    if (userId) {
      set({ userId: userId });
    }
  },
});

const useSignupStore = create(devtools(signupStore));

export default useSignupStore;
