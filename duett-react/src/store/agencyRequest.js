import create from 'zustand';
import { devtools } from 'zustand/middleware';

import api from '../lib/api';

const agencyRequestStore = (set, get) => ({
  requests: [],
  columns: [],
  requestCount: 0,

  clients: [],
  clientColumns: [],
  clientCount: 0,

  loadingRequests: false,

  servicesList: [],
  fundingList: [],
  stateRefresher: {},

  isNavigating: true,
  setNavigating: (val) => {
    set({ isNavigating: val });
  },

  setDefaultHistoryStatus: () => {
    set({
      filterStatus: {
        partiallyMatched: true,
        closed: true,
        opened: true,
        archived: true,
        pending: true,
      },
    });
  },

  setDefaultStatus: () => {
    set({
      filterStatus: {
        partiallyMatched: true,
        closed: false,
        opened: true,
        archived: false,
        pending: true,
      },
    });
  },

  statusType: '',
  setStatusType: (val) => {
    set({ statusType: val });
  },

  filterStatus: {
    partiallyMatched: true,
    closed: false,
    opened: true,
    archived: false,
    pending: true,
  },

  error: '',
  searching: false,
  setSearching: (val) => {
    set({ searching: val });
  },

  setResponseAttributes: (res, type) => {
    let err = '';

    if (res?.data) {
      if (type !== 'clients') {
        set({
          requests: res.data?.rows,
          columns: res.data?.columns,
          requestCount: res.data?.count,
          servicesList: res.data?.service_type,
          fundingList: res.data?.funding_source,
        });
      } else {
        set({
          clients: res.data?.rows,
          clientColumns: res.data?.columns,
          clientCount: res.data?.count,
        });
      }
      err = res?.data?.message;
    } else {
      err = 'Failed to Load Request';
    }

    set({
      loadingRequests: false,
      error: err,
    });
  },

  loadAgencyRequestData: async (req_url, type) => {
    const {
      limit,
      sort,
      filters,
      statusType,
      filterStatus,
      checkedServices,
      setResponseAttributes,
      checkedFundingSources,
    } = get();
    const offset = get().getOffset();

    try {
      if (type !== statusType) {
        set({ page: 0, limit: 10 });
      }

      set({
        loadingRequests: true,
        requests: [],
        statusType: type,
        searching: false,
      });

      const encodeParams = (param) => encodeURIComponent(JSON.stringify(param));

      const funding = encodeParams(checkedFundingSources);
      const services = encodeParams(checkedServices);
      const status = encodeParams(filterStatus);
      const manager = encodeParams(filters);

      let url = `/api/get/${req_url}?limit=${limit}&offset=${offset}&ordering=${sort}`;
      url += `&funding=${funding}&services=${services}&status=${status}&manager_name=${manager}`;

      const res = await api.get(url);
      setResponseAttributes(res, type);
    } catch (err) {
      setResponseAttributes(err?.response, type);
    }
  },

  page: 0,
  setPage: (val) => set({ page: val }),

  limit: 10,
  setLimit: (val) => set({ limit: val }),

  sort: '',
  setSort: (val) => set({ sort: val }),

  filters: {},
  filterInput: '',

  filterMenu: {
    open: false,
    popField: '',
  },

  filterStatusMenu: {
    open: false,
    field: '',
  },

  checkedFundingSources: [],
  setCheckedFundingSources: (val) => {
    set({ checkedFundingSources: val });
  },

  checkedServices: [],
  setCheckedServicesFilter: (val) => {
    set({ checkedServices: val });
  },

  filterRequests: async (url, type) => {
    const { loadAgencyRequestData } = get();
    set({ page: 0 });
    set({ stateRefresher: {} });
    // await loadAgencyRequestData(url, type);
  },

  resetFilters: (changelimit = true, type = '') => {
    const { setDefaultHistoryStatus, setDefaultStatus } = get();

    if (changelimit) {
      set({ limit: 10 });
    }

    set({
      page: 0,
      stateRefresher: {},
    });

    if (changelimit) {
      set({
        sort: '',
        checkedServices: [],
        checkedFundingSources: [],
        filters: {},
        filterInput: '',
      });
      if (type === 'history') {
        setDefaultHistoryStatus();
      } else {
        setDefaultStatus();
      }
    }
  },

  resetGrid: async (val = true, type = '', search = true) => {
    const { resetFilters } = get();
    resetFilters(val, type);
    if (search) {
      set({ searchVal: '' });
    }
    set({ stateRefresher: {} });
  },

  setFilter: (field, value) =>
    set((state) => ({ filters: { ...state.filters, [field]: value } })),

  setFilterPopper: (open, field) => {
    set((state) => ({
      filterMenu: {
        ...state.filterMenu,
        open: open,
        popField: field,
      },
    }));
  },

  setFilterStatusMenu: (open, field) => {
    set((state) => ({
      filterStatusMenu: {
        ...state.filterStatusMenu,
        open: open,
        field: field,
      },
    }));
  },

  setFilterInput: (val) => {
    set((state) => ({
      filterMenu: {
        ...state.filterMenu,
        filterInput: val,
      },
    }));
  },

  getOffset: () => {
    let { page, limit } = get();
    return page * limit;
  },

  setFilterStatus: (filterKey) => {
    set((state) => ({
      filterStatus: {
        ...state.filterStatus,
        [filterKey]: !state.filterStatus[filterKey],
      },
    }));
  },

  copyFilterStatus: (status) => {
    set({ filterStatus: { ...status } });
  },

  searchResults: [],
  searchVal: '',

  setSearchVal: (val) => {
    set({ searchVal: val });
  },

  searchHandler: async (query, url, id = null, setLocation) => {
    const {
      sort,
      limit,
      filters,
      statusType,
      filterStatus,
      checkedServices,
      setResponseAttributes,
      checkedFundingSources,
    } = get();

    const offset = get().getOffset();

    set({ loadingRequests: true, searching: true });

    try {
      const user = JSON.parse(localStorage.getItem('CURRENT_USER'));
      const searchId = id ? id : user?.id;

      const encodeParams = (param) => encodeURIComponent(JSON.stringify(param));

      const funding = encodeParams(checkedFundingSources);
      const services = encodeParams(checkedServices);
      const status = encodeParams(filterStatus);
      const manager = encodeParams(filters);

      let api_url = `/api/search/${url}/${searchId}/?search_input=${query}&limit=${limit}&offset=${offset}&ordering=${sort}`;
      api_url += `&funding=${funding}&services=${services}&status=${status}&manager_name=${manager}`;

      const res = await api.get(api_url);

      if (
        !isNaN(query) &&
        res?.data?.rows?.length > 0 &&
        statusType !== 'clients'
      ) {
        setLocation(`/request/${res?.data?.rows[0]?.id}`);
      }

      setResponseAttributes(res, statusType);
    } catch (err) {
      setResponseAttributes(err?.response, statusType);
    }
  },
});

let useAgencyRequestStore;
if (process.env.NODE_ENV !== 'production') {
  useAgencyRequestStore = create(devtools(agencyRequestStore));
} else {
  useAgencyRequestStore = create(agencyRequestStore);
}

export default useAgencyRequestStore;
