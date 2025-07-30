import create from 'zustand';
import { devtools } from 'zustand/middleware';

import api from '../lib/api';
import { accountTypes } from '../hooks/useRole';

const careRequestStore = (set, get) => ({
  requests: [],
  requestsCount: 0,
  loadingRequests: false,
  requestHistory: [],
  historyLoading: false,
  loadRequests: async (
    account,
    currentRequestId,
    { isPrevious, setLocation, isNext } = {},
    accountType
  ) => {
    const {
      limit,
      search,
      sort,
      showHiddenChecked,
      showAllRequests,
      showAdminCases,
      openChecked,
      pendingChecked,
      closedChecked,
      showPartiallyMatched,
      page,
      loadDetailRequest,
      requests,
      getNotesRequest,
      clearOutFilter,
    } = get();
    const status_in = get().getStatusIn(accountType);
    const offset = get().getOffset();
    const user = JSON.parse(localStorage?.CURRENT_USER);
    const isAdmin = user?.group === 'Care Agency Admin';

    set({ loadingRequests: true });

    try {
      const path = showAllRequests
        ? `/api/agencies/${account}/requests/`
        : '/api/requests/';

      // get set params to localstorage
      const params = {
        limit,
        offset,
        search,
        sort,
        showHiddenChecked,
        showAllRequests,
        showAdminCases,
        openChecked,
        pendingChecked,
        closedChecked,
        showPartiallyMatched,
        page,
      };

      localStorage.setItem(
        'careRequestsDetailsViewParams',
        JSON.stringify(params)
      );

      const setSortParam = (sort, path) => {
        if (sort === '-created_at') {
          return '-refreshed_time';
        } else if (sort === 'created_at') {
          return 'refreshed_time';
        } else {
          return sort;
        }
      };

      let qs = `limit=${limit}&offset=${offset}&search=${search}
        &ordering=${setSortParam(sort, path)}&show_hidden=${showHiddenChecked}`;
      if (isAdmin) {
        qs += `&show_caa_cases=${showAdminCases}&is_archived=0`;
        const isToggled =
          openChecked ||
          pendingChecked ||
          closedChecked ||
          showPartiallyMatched;
        if (isToggled) {
          qs += `&status_in=${status_in}`;
        }
      } else {
        if (!showAllRequests) {
          qs += `&status_in=${status_in}`;
        }
        if (!showAllRequests && !closedChecked) {
          qs += `&is_archived=0`;
        }
      }
      const res = await api.get(`${path}?${qs}`);

      let { results, count } = res.data;

      // Find request id and set detail index from results;
      if (currentRequestId) {
        const index = results.findIndex((req) => req.id === +currentRequestId);
        const olderIndex = requests.findIndex(
          (req) => req.id === +currentRequestId
        );
        if (index !== -1) {
          set({ detailIndex: index });
        }

        if (index === -1 && olderIndex === -1) {
          count = 0;
        }
      }

      set({
        loadingRequests: false,
        requests: results,
        requestsCount: count,
        totalPage: Math.ceil(count / limit),
      });

      // redirect when get new results for previous and next
      if (isPrevious || isNext) {
        const index = isPrevious ? results.length - 1 : 0;
        const newDetails = results[index];
        getNotesRequest(newDetails.id);
        set({ detailIndex: index });
        setLocation(`/request/${newDetails.id}`);
        await loadDetailRequest(newDetails.id);
      }
    } catch (err) {
      if (currentRequestId) {
        throw err;
      }
      console.log('err', err.message);
    }
  },

  tableColumns: [],
  loadingColumns: false,
  loadingNotes: false,
  loadTableColumns: async () => {
    try {
      set({ loadingColumns: true });
      const path = '/api/table-columns/?table=1';
      const res = await api.get(path);

      set({
        loadingColumns: false,
        tableColumns: res.data,
      });
    } catch (err) {
      set({ loadingColumns: false });
      console.log('err', err.message);
    }
  },

  detailRequest: null,
  loadingDetail: false,
  detailIndex: null,
  requestNotes: [],
  notesLoading: false,
  undoLoading: false,
  setDetailIndex: (val) => set({ detailIndex: val }),
  setDetailRequest: (val) => set({ detailRequest: val }),
  loadDetailRequest: async (id, loading = true) => {
    const { requests, detailIndex } = get();
    set({ loadingDetail: loading });
    let res = await api.get(`/api/requests/${id}/`);
    set({ detailRequest: res.data, loadingDetail: false });
    if (detailIndex !== null) {
      // IF we are updating a single care requests and have the index, we should update it in the dashboard list as well
      let newRequests = [...requests];
      newRequests[detailIndex] = res.data;
      set({ requests: newRequests });
    }
  },

  getNotesRequest: async (id) => {
    try {
      set({ notesLoading: true });
      const { data } = await api.get(`/api/requests/${id}/notes/`);
      set({ requestNotes: data, notesLoading: false });
    } catch (err) {
      console.log('err', err.message);
    }
  },

  clearDetailRequest: () => {
    set({ detailRequest: null, detailIndex: null });
  },

  reloadDetailRequest: (loading) => {
    const detailRequest = get().detailRequest;
    const loadDetailRequest = get().loadDetailRequest;
    return loadDetailRequest(detailRequest.id, loading);
  },

  updatesNotes: (notes) => {
    set({ requestNotes: notes });
  },

  search: '',
  setSearch: (val) => set({ search: val }),

  page: 0,
  setPage: (val) => set({ page: val }),

  limit: 10,
  setLimit: (val) => set({ limit: val }),

  sort: '-refreshed_time',
  setSort: (val) => set({ sort: val }),

  openChecked: false,
  toggleOpenChecked: () =>
    set((state) => ({
      openChecked: !state.openChecked,
    })),

  pendingChecked: false,
  togglePendingChecked: () =>
    set((state) => ({
      pendingChecked: !state.pendingChecked,
    })),

  closedChecked: false,
  toggleClosedChecked: () =>
    set((state) => ({
      closedChecked: !state.closedChecked,
    })),

  showAllRequests: false,
  toggleShowAllRequests: () =>
    set((state) => ({
      showAllRequests: !state.showAllRequests,
    })),

  showAdminCases: true,
  toggleShowMyCases: () =>
    set((state) => ({
      showAdminCases: !state.showAdminCases,
    })),

  showPartiallyMatched: false,
  toggleShowPartiallyMatched: () =>
    set((state) => ({
      showPartiallyMatched: !state.showPartiallyMatched,
    })),

  showHiddenChecked: false,
  toggleShowHiddenChecked: () =>
    set((state) => ({
      showHiddenChecked: !state.showHiddenChecked,
    })),

  getStatusIn: (accountType) => {
    let {
      openChecked,
      pendingChecked,
      closedChecked,
      showPartiallyMatched,
    } = get();

    let status_in = [];
    if (
      !openChecked &&
      !pendingChecked &&
      !closedChecked &&
      !showPartiallyMatched
    ) {
      status_in = accountType === accountTypes.PROVIDER ? [1, 2, 3] : [1, 2];
    }

    if (openChecked) status_in = [1];
    if (pendingChecked) status_in = [...status_in, 2];
    if (closedChecked) status_in = [...status_in, 3];
    if (showPartiallyMatched) status_in = [...status_in, 4];
    return status_in;
  },

  getOffset: () => {
    let { page, limit } = get();
    return page * limit;
  },

  setParams: (params) => {
    set(params);
  },

  fundingSources: [],
  loadFundingSources: async () => {
    try {
      const res = await api.get('/api/funding-sources/');
      set({ fundingSources: res.data });
    } catch (err) {
      console.log('err', err.message);
    }
  },

  getCityStateFromZip: async (zipcode) => {
    try {
      const {
        data: [{ city, state }],
      } = await api.get(`/api/requests/zipcode/${zipcode}`);
      return { city, state };
    } catch (e) {
      console.log('Zip could not be found');
      return {};
    }
  },

  getRequestActivity: async (id) => {
    try {
      set({ historyLoading: true });
      const { data } = await api.get(`/api/requests/${id}/request_activity`);
      set({ requestHistory: data.data, historyLoading: false });
    } catch (err) {
      console.log('err', err.message);
    }
  },

  serviceRequestDelete: async (requestId, serviceId) => {
    return api.delete(
      `/api/requests/${requestId}/service_request_delete/${serviceId}`
    );
  },

  serviceRequestReopen: async (requestId, serviceId, payload) => {
    return api.post(
      `/api/requests/${requestId}/service_reopen/${serviceId}`,
      payload
    );
  },

  getProviderList: async (requestId, serviceId) => {
    return api.get(
      `/api/requests/${requestId}/service_provider_list/${serviceId}`
    );
  },

  serviceReassign: async (requestId, serviceId, payload) => {
    return api.post(
      `/api/requests/${requestId}/service_reassign/${serviceId}`,
      payload
    );
  },

  setUndoLoading: (value) => {
    set({ undoLoading: value });
  },

  clearOutFilter: () => {
    set({
      showAdminCases: true,
      showHiddenChecked: null,
      showAllRequests: null,
      openChecked: null,
      pendingChecked: null,
      closedChecked: null,
      showPartiallyMatched: null,
    });
  },
});

let useCareRequestStore;
if (process.env.NODE_ENV !== 'production') {
  useCareRequestStore = create(devtools(careRequestStore));
} else {
  useCareRequestStore = create(careRequestStore);
}

export default useCareRequestStore;
