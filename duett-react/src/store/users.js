import create from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../lib/api';

const userStore = (set, get) => ({
  users: [],
  usersCount: 0,
  loadingUsers: false,

  loadUsers: async () => {
    const { limit, search, sort } = get();
    const offset = get().getOffset();

    try {
try {
  set({ loadingUsers: true });
  let res = await api.get(`/api/users/?limit=${limit}&offset=${offset}&search=${search}&ordering=${sort}`);
} catch (error) {
  console.error(error);
}
      );
      set({
        loadingUsers: false,
        users: res.data.results,
        usersCount: res.data.count,
      });
    } catch (err) {
      set({ loadingUsers: false });
      console.log('err', err.message);
    }
  },

  search: '',
  setSearch: (val) => set({ search: val }),

  page: 0,
  setPage: (val) => set({ page: val }),

  limit: 10,
  setLimit: (val) => set({ limit: val }),

  sort: 'userprofile__last_name',
  setSort: (val) => set({ sort: val }),

  getOffset: () => {
    let { page, limit } = get();
    return page * limit;
  },
});

let useUserStore;
if (process.env.NODE_ENV !== 'production') {
  useUserStore = create(devtools(userStore));
} else {
  useUserStore = create(userStore);
}

export default useUserStore;
