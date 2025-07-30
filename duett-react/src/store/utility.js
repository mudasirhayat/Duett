import { sort } from 'fast-sort';
import { SearchType, filterData } from 'filter-data';
import create from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../lib/api';
import { filterLambda } from '../components/agencyDashboard/Filters/FilterLambda';

const filterSortStore = (set, get) => ({
  searchResults: [],
  statusType: '',
  sortActive: false,
  sortOrder: '',
  sortField: '',

  popper: {
    open: false,
    popField: '',
    popValue: '',
  },

  filterMenu: {
    open: false,
    popField: '',
  },

  filterStatusMenu: {
    open: false,
    field: '',
  },

  searchVal: '',
  searchData: null,

  filters: {},
  filterInput: '',
  checkedServices: [],
  checkedFundingSources: [],

  servicesList: [],
  fundingList: [],

  setCheckedServicesFilter: (val) => {
    set({ checkedServices: val });
  },

  setCheckedFundingSources: (val) => {
    set({ checkedFundingSources: val });
  },

  setSearchVal: (val) => {
    set({ searchVal: val });
  },

  resetSearch: () => {
    set({ searchVal: '' });
  },

  resetClientsPage: () => {
    set({
      searchError:
        'Please search for a First Name and Last Name. If the record you are searching for has multiple last names, please simply search for one of the last names. You may also search for a birthdate by providing the date in MM/DD/YYYY format. For example, 10/14/1950.',
    });
  },

  setFilter: (field, value) =>
    set((state) => ({ filters: { ...state.filters, [field]: value } })),

  filterStatus: {
    partiallyMatched: true,
    closed: false,
    opened: true,
    archived: false,
    received: true,
  },

  gridLoader: false,
  errors: null,
  searchError: null,

  requestData: null,
  columns: null,
  requestProxyData: null,

  clientData: null,
  clientColumns: null,
  clientProxyData: null,

  setRequestData: (row, col) => {
    set({ requestProxyData: row, requestData: row, columns: col });
  },

  setRequestProxyData: (val) => {
    set({ requestProxyData: val });
  },

  setClientData: (row, col) => {
    set({ clientProxyData: row, clientData: row, clientColumns: col });
  },

  setClientProxyData: (val) => {
    set({ clientProxyData: val });
  },

  clearFilterStatuses: () => {
    set((state) => ({
      filterStatus: {
        ...state.filterStatus,
        partiallyMatched: true,
        closed: false,
        opened: true,
        archived: false,
        received: true,
      },
    }));
  },

  clearFilterStatusesHistory: () => {
    set((state) => ({
      filterStatus: {
        ...state.filterStatus,
        partiallyMatched: true,
        closed: true,
        opened: true,
        archived: true,
        received: true,
      },
    }));
  },

  setProxyRequest: (data) => {
    set({ proxyRequest: data });
  },

  setGridLoader: (data) => {
    set({ gridLoader: data });
  },

  searchHandler: async (
    query,
    url,
    id = null,
    setLocation,
    data,
    setProxyData
  ) => {
    const {
      clearSortFilter,
      filterStatusData,
      clearFilterStatuses,
      clearFilterStatusesHistory,
      statusType,
    } = get();

    set({ gridLoader: true, searchData: null, searchError: '' });
    setProxyData([]);
    try {
      if (statusType !== 'clients') {
        clearSortFilter(data, setProxyData);
      }

      const user = JSON.parse(localStorage.getItem('CURRENT_USER'));
      const searchId = id ? id : user?.id;
      const response = await api.get(
        `/api/search/${url}/${searchId}/?search_input=${query}`
      );

      if (
        !isNaN(query) &&
        response?.data?.length > 0 &&
        statusType !== 'clients'
      ) {
        setLocation(`/request/${response?.data[0]?.id}`);
      }

      if (statusType !== 'clients') {
        clearFilterStatusesHistory();
        const filtered = filterStatusData(response?.data);
        setProxyData(filtered);
      } else {
        setProxyData(response?.data);
      }

      set({ searchData: response?.data, searchError: '' });
    } catch (err) {
      console.log(err.response?.data);
      set({ searchError: err.response?.data?.message });
    } finally {
      set({ gridLoader: false });
    }
  },

  setPopper: (open, field) => {
    set((state) => ({
      popper: {
        ...state.popper,
        open: open,
        popField: field,
        popValue: '',
      },
    }));
  },

  setAplhaSortPopper: (open) => {
    set((state) => ({
      popper: {
        ...state.popper,
        open: open,
      },
    }));
  },

  loadData: async (
    dataUrl,
    data,
    setRequest,
    setProxyData,
    requestType = null
  ) => {
    const { clearSortFilter, resetClientsPage } = get();

    if (requestType !== 'clients') {
      clearSortFilter(data, setProxyData);
    }

    try {
      const response = await api.get(`${dataUrl}`);
      if (requestType === 'clients') {
        resetClientsPage();
      }
      setRequest(response?.data?.rows, response?.data?.columns);
      set({
        servicesList: response?.data?.service_type,
        fundingList: response?.data?.funding_source,
      });
    } catch (err) {
      console.log(err.response);
      set({ searchError: 'Failed to Load Requests', gridLoader: false });
    } finally {
      set({ gridLoader: false });
    }
  },

  loadRequestData: async (requestType, id, data, setRequest, setProxyData) => {
    const { loadData, setDefaultFilter, setDefaultHistoryFilter } = get();

    set({
      gridLoader: true,
      statusType: requestType,
      searchData: [],
      searchVal: '',
    });
    const user = JSON.parse(localStorage.getItem('CURRENT_USER'));

    switch (requestType) {
      case 'clients':
        await loadData(
          `/api/get/client/${user?.id}`,
          data,
          setRequest,
          setProxyData,
          requestType
        );
        break;
      case 'history':
        await loadData(
          `/api/get/clienthistory/${id}`,
          data,
          setRequest,
          setProxyData
        );
        await setDefaultHistoryFilter(setProxyData);
        break;
      case 'requests':
        await loadData(
          `/api/get/carerequest/${user?.id}`,
          data,
          setRequest,
          setProxyData
        );
        await setDefaultFilter(setProxyData);
        break;
      default:
        set({ searchError: 'Network Error Check Internet', gridLoader: false });
        break;
    }

    return;
  },

  clearSortFilter: (data, setProxyData) => {
    const {
      setPopper,
      setFilterPopper,
      setFilterStatusMenu,
      setFilterInput,
      setFilterStatus,
      clearFilterStatuses,
      clearFilterStatusesHistory,
      filterStatusData,
      statusType,
      resetClientsPage,
    } = get();

    if (statusType !== 'history') {
      clearFilterStatuses();
    } else {
      clearFilterStatusesHistory();
    }

    setPopper(false, '');
    setFilterPopper(false, '');
    setFilterStatusMenu(false, '');
    setFilterInput('');
    setFilterStatus('');
    set({ searchError: '' });
    set({ filters: [], searchData: null });
    if (statusType === 'clients') {
      resetClientsPage();
    } else {
      const filtered = filterStatusData(data);
      setProxyData(filtered);
    }
    set({
      checkedFundingSources: [],
      checkedServices: [],
      sortActive: false,
      sortField: '',
      sortOrder: '',
      errors: null,
    });
  },

  setStatusType: (type) => {
    set({ statusType: type });
  },

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

  copyFilterStatus: (status) => {
    set({ filterStatus: { ...status } });
  },

  setFilterStatus: (filterKey) => {
    set((state) => ({
      filterStatus: {
        ...state.filterStatus,
        [filterKey]: !state.filterStatus[filterKey],
      },
    }));
  },

  getFilterStatus: () => {
    const { filterStatus } = get();
    return Object?.keys(filterStatus)?.some(
      (key) => key !== '' && filterStatus[key]
    );
  },

  setDefaultFilter: async (setProxyData) => {
    const { filterStatusData, requestData, clearFilterStatuses } = get();
    clearFilterStatuses();
    const filtered = filterStatusData(requestData);
    setProxyData(filtered);
  },

  setDefaultHistoryFilter: async (setProxyData) => {
    const { filterStatusData, requestData, clearFilterStatusesHistory } = get();
    clearFilterStatusesHistory();
    const filtered = filterStatusData(requestData);
    setProxyData(filtered);
  },

  filterStatusData: (proxy) => {
    const { getFilterStatus, filterStatus } = get();

    set({ errors: '' });
    if (!getFilterStatus()) {
      return proxy;
    }

    const statusMapping = {
      partiallyMatched: 'Partially Matched',
      opened: 'Open',
      archived: 'Archived',
      received: 'Submissions Received',
      closed: 'Matched',
    };

    const filteredData = proxy?.filter((item) => {
      return Object?.entries(filterStatus)?.some(([key, isActive]) => {
        return isActive && item?.status === statusMapping[key];
      });
    });

    if (filteredData?.length === 0) {
      set({ errors: 'No filtered items found' });
      return [];
    }

    return filteredData;
  },

  sortRequest: (field, order, active, header, proxyData, setProxyData) => {
    const { popper } = get();
    const { open } = popper;

    if (order === 'asc') {
      setProxyData(sort(proxyData).asc(field));
    } else {
      setProxyData(sort(proxyData).desc(field));
    }
    set({ sortActive: active, sortField: header });
    set((state) => ({
      popper: {
        ...state.popper,
        open: open,
        popField: header,
        popValue: order,
      },
    }));
  },

  filterDataByField: (selectedKey, keyExtractor, data) => {
    if (selectedKey?.length === 0) {
      return data;
    }
    const filteredItems = data
      .map((row) => ({
        ...row,
        services: row.services.filter((service) =>
          selectedKey.includes(keyExtractor(service))
        ),
      }))
      .filter((row) => row.services.length > 0);
    return filteredItems;
  },

  filterRequests: (data, setProxyData) => {
    const {
      filters,
      filterDataByField,
      searchData,
      filterStatusData,
      checkedServices,
      checkedFundingSources,
      clearFilterStatusesHistory,
    } = get();

    set({ errors: null });

    let proxy = searchData ? searchData : data;

    console.log(filters);
    Object?.entries(filters)?.map(([field, value]) => {
      if (field) {
        if (field === 'services') {
          const keyExtractor = (service) => service?.service;
          proxy = [...filterDataByField(checkedServices, keyExtractor, proxy)];
        } else if (field === 'funding') {
          const keyExtractor = (service) => service?.funding_source;
          proxy = [
            ...filterDataByField(checkedFundingSources, keyExtractor, proxy),
          ];
        } else {
          const data = filterData(proxy, [
            {
              key: filterLambda[field],
              value: value?.trim(),
              type: SearchType.LK,
            },
          ]);

          proxy = [...data];
        }
      }
      return true;
    });

    if (proxy.length < 1) {
      setProxyData(proxy);
      set({
        errors: 'No filtered items found',
      });
    } else {
      proxy = [...filterStatusData(proxy)];
      setProxyData(proxy);
    }
  },
});

let useFilterSortStore;
if (process.env.NODE_ENV !== 'production') {
  useFilterSortStore = create(devtools(filterSortStore));
} else {
  useFilterSortStore = create(filterSortStore);
}

export default useFilterSortStore;
