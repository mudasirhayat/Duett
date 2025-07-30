import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
  InputAdornment,
} from '@material-ui/core';
import DrawerPage from '../../components/app/DrawerPage';
import FlexBox from '../../components/layout/FlexBox';
import AddIcon from '@material-ui/icons/Add';
import AntSwitch from '../../components/forms/AntSwitch';
import PlainInput from '../../components/forms/PlainInput';
import SearchIcon from '@material-ui/icons/Search';
import useAuthStore from '../../store/auth';
import useCareRequestStore from '../../store/careRequests';
import CareRequestRow from '../../components/dashboard/CareRequestRow';
import CareRequestColumn from '../../components/dashboard/CareRequestColumn';
import LoadingBox from '../../components/layout/LoadingBox';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { useLocation } from 'wouter';
import { accountTypes, useAccountType } from '../../hooks/useRole';
import { RoleMatch, RoleSwitch } from '../../components/app/RoleSwitch';
import SettingsWrapper from '../../components/dashboard/SettingsWrapper';
import UserPromptModal from '../../components/2fA/UserPromptModal';
import { isMoreThanTwoWeeks } from '../../lib/helpers';
import api from '../../lib/api';

const useStyles = makeStyles((theme) => ({
  input: {
    marginRight: theme.spacing(1),
    width: 300,
    flex: 'auto',
  },
  paginationTableRow: {
    paddingLeft: 0,
    border: 0,
  },
  paginationTableCell: {
    padding: '0px !important',
    border: 0,
    display: 'table-cell',
  },
  searchIcon: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

const DashboardPage = () => {
  const classes = useStyles();
  const theme = useTheme();

  try {
    useAuthStore((state) => [state.user.twofactor.otp_2fa_enabled]);
  } catch {
    localStorage.clear();
    window.location.reload();
  }

  const [, setLocation] = useLocation();
  const {
    loadRequests,
    loadingRequests: loading,
    tableColumns,
    loadTableColumns,
    openChecked,
    pendingChecked,
    closedChecked,
    showAllRequests,
    showAdminCases,
    showHiddenChecked,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    sort,
    setSort,
    setDetailRequest,
    setDetailIndex,
    showPartiallyMatched,
    ...requestStore
  } = useCareRequestStore();

  const accountType = useAccountType();
  const isAgency = accountType === accountTypes.AGENCY;
  const account = useAuthStore((state) => state.user.account);
  const user_preferences = useAuthStore((state) => state.user.user_preferences);
  const isAdmin =
    useAuthStore((state) => state.user.group) === 'Care Agency Admin';
  const [otpEnabled, disable2FA, promptedDate, getUserLoading] = useAuthStore(
    (state) => [
      state.user.twofactor.otp_2fa_enabled ||
        state.user.twofactor.qr_2fa_enabled,
      state.user.twofactor.disable_2fa,
      state.user.twofactor.last_prompted_provider,
      state.getUserLoading,
    ]
  );
  const disabled2FA = disable2FA && !otpEnabled;
  const promptProvider = isMoreThanTwoWeeks(promptedDate);

  function canOpenModal() {
    if (!otpEnabled && (isAgency || promptProvider)) {
      return true;
    }
    return false;
  }

  const impersonate = localStorage.getItem('impersonate');
  const openModal = canOpenModal();

  const [columns, setColumns] = useState([]);
  const [isApproved, setIsApproved] = useState(null); // Approval status state
  const [loadingApprovalStatus, setLoadingApprovalStatus] = useState(true); // Loading state for approval check
  const [error, setError] = useState(null); // Error handling state

  const [searchInput, setSearchInput] = useState(search);

  function handleChangeRowsPerPage(event) {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  }

  function handleSearch() {
    searchRequests(searchInput);
  }

  function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
      setSearch(event.target.value);
      setPage(0);
    }
  }

  function searchRequests(value) {
    setSearch(value);
    setPage(0);
  }

  function clearSearch() {
    setSearchInput('');
    searchRequests('');
  }

  useEffect(() => {
    loadTableColumns();
  }, [loadTableColumns]);

  useEffect(() => {
    if (user_preferences?.request_table_columns && tableColumns.length) {
      const column_ids = user_preferences.request_table_columns.split(',');
      const columns = column_ids
        .map((column_id) => {
          return tableColumns.find((col) => col.id === parseInt(column_id));
        })
        .filter((col) => !!col);
      setColumns(columns);
    } else {
      setColumns(tableColumns.filter((col) => !!col));
    }
  }, [tableColumns, user_preferences]);

  // New useEffect to fetch approval status
  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        setLoadingApprovalStatus(true);
        const response = await api.get('/api/users/dashboard-view/');
        if (response.status === 202) {
          setIsApproved(true);
        } else if (response.status === 206) {
          setIsApproved(false);
        } else {
          setError('Failed to Fetch Approval Status');
        }
      } catch (err) {
        setError('Failed to Fetch Approval Status');
      } finally {
        setLoadingApprovalStatus(false);
      }
    };

    fetchApprovalStatus();
  }, []);

  useEffect(() => {
    loadRequests(account, null, {}, accountType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loadRequests,
    account,
    page,
    limit,
    search,
    sort,
    openChecked,
    pendingChecked,
    closedChecked,
    showAllRequests,
    showAdminCases,
    showHiddenChecked,
    showPartiallyMatched,
  ]);

  if (loadingApprovalStatus) {
    return <LoadingBox loading={true} />;
  }

  if (error) {
    return <Box>{error}</Box>;
  }

  return (
    <>
      {!getUserLoading && !disabled2FA && !impersonate && (
        <UserPromptModal open={openModal} provider={!isAgency} />
      )}
      <DrawerPage linkProps={{ onClick: clearSearch }} isApproved={isApproved}>
        <Box px={4} py={2} width="100%">
          {!isApproved && (
            <Box>
              <h1>Approval Pending</h1>
              <p>
                Your profile is currently under review. Certain features are
                restricted until your profile is approved.
              </p>
            </Box>
          )}

          {isApproved && (
            <>
              <FlexBox justifyContent="space-between" mb={2}>
                <FlexBox>
                  <PlainInput
                    id="search"
                    name="search"
                    disabled={loading}
                    placeholder="Search"
                    className={classes.input}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          disabled={loading}
                          className={classes.searchIcon}
                          onClick={handleSearch}
                        >
                          <SearchIcon fontSize="small" color="primary" />
                        </IconButton>
                      </InputAdornment>
                    }
                    onKeyPress={handleSearchKeyPress}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </FlexBox>
                <FlexBox>
                  <RoleSwitch account>
                    <RoleMatch role={accountTypes.AGENCY}>
                      <Button
                        variant="outlined"
                        color="primary"
                        style={{ marginRight: theme.spacing(1) }}
                        disableElevation
                        onClick={() => setLocation('/request/new')}
                      >
                        <AddIcon fontSize="small" />
                        Care Request
                      </Button>
                    </RoleMatch>
                  </RoleSwitch>
                </FlexBox>
              </FlexBox>

              <FlexBox
                alignItems={'center'}
                justifyContent={'space-between'}
                mb={2}
              >
                <FlexBox alignItems={'center'}>
                  {isAgency && isAdmin && (
                    <>
                      <FlexBox alignItems={'center'} mr={4}>
                        <Box mr={1}>
                          <AntSwitch
                            disabled={loading}
                            checked={showAdminCases}
                            onChange={() => {
                              requestStore.toggleShowMyCases();
                              setPage(0);
                            }}
                            name="showMyCases"
                          />
                        </Box>
                        My Cases Only
                      </FlexBox>
                    </>
                  )}
                  <FlexBox alignItems={'center'} mr={4}>
                    <Box mr={1}>
                      <AntSwitch
                        disabled={loading}
                        checked={openChecked}
                        onChange={() => {
                          requestStore.toggleOpenChecked();
                          setPage(0);
                        }}
                        name="openChecked"
                      />
                    </Box>
                    <RoleSwitch account>
                      <RoleMatch role={accountTypes.AGENCY}>
                        Open Care Requests
                      </RoleMatch>
                      <RoleMatch role={accountTypes.PROVIDER}>
                        New Care Requests
                      </RoleMatch>
                    </RoleSwitch>
                  </FlexBox>

                  <FlexBox alignItems={'center'} mr={4}>
                    <Box mr={1}>
                      <AntSwitch
                        disabled={loading}
                        checked={pendingChecked}
                        onChange={() => {
                          requestStore.togglePendingChecked();
                          setPage(0);
                        }}
                        name="pendingChecked"
                      />
                    </Box>
                    <RoleSwitch account>
                      <RoleMatch role={accountTypes.AGENCY}>
                        Pending Matches
                      </RoleMatch>
                      <RoleMatch role={accountTypes.PROVIDER}>
                        Submitted Requests
                      </RoleMatch>
                    </RoleSwitch>
                  </FlexBox>

                  <FlexBox alignItems={'center'} mr={4}>
                    <Box mr={1}>
                      <AntSwitch
                        disabled={loading}
                        checked={closedChecked}
                        onChange={() => {
                          requestStore.toggleClosedChecked();
                          setPage(0);
                        }}
                        name="closedChecked"
                      />
                    </Box>
                    <RoleSwitch account>
                      <RoleMatch role={accountTypes.AGENCY}>
                        Closed Matches
                      </RoleMatch>
                      <RoleMatch role={accountTypes.PROVIDER}>
                        Matched Requests
                      </RoleMatch>
                    </RoleSwitch>
                  </FlexBox>

                  {isAgency && (
                    <>
                      <FlexBox alignItems={'center'} mr={4}>
                        <Box mr={1}>
                          <AntSwitch
                            disabled={loading}
                            checked={showPartiallyMatched}
                            onChange={() => {
                              requestStore.toggleShowPartiallyMatched();
                              setPage(0);
                            }}
                            name="partiallyMatched"
                          />
                        </Box>
                        Partially Matched
                      </FlexBox>
                      {!isAdmin && (
                        <FlexBox alignItems={'center'} mr={4}>
                          <Box mr={1}>
                            <AntSwitch
                              disabled={loading}
                              checked={showAllRequests}
                              onChange={() => {
                                requestStore.toggleShowAllRequests();
                                setPage(0);
                              }}
                              name="showAllRequests"
                            />
                          </Box>
                          View All Requests
                        </FlexBox>
                      )}
                    </>
                  )}

                  <RoleSwitch account>
                    <RoleMatch role={accountTypes.PROVIDER}>
                      <FlexBox alignItems={'center'} mr={4}>
                        <Box mr={1}>
                          <AntSwitch
                            disabled={loading}
                            checked={showHiddenChecked}
                            onChange={() => {
                              requestStore.toggleShowHiddenChecked();
                              setPage(0);
                            }}
                            name="openChecked"
                          />
                        </Box>
                        Show Hidden
                      </FlexBox>
                    </RoleMatch>
                  </RoleSwitch>
                </FlexBox>
                <SettingsWrapper />
              </FlexBox>

              <LoadingBox loading={loading}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => {
                          return (
                            <CareRequestColumn
                              key={column.id}
                              column={column}
                              sort={sort}
                              setSort={setSort}
                            />
                          );
                        })}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {requestStore.requests?.map((request, index) => (
                        <CareRequestRow
                          key={`Request_${request.id}`}
                          request={request}
                          index={index}
                          columns={columns}
                        />
                      ))}
                      {requestStore.requestsCount < 1 && !loading ? (
                        <TableRow>
                          <TableCell colSpan="7">
                            No Matching Care Requests
                          </TableCell>
                        </TableRow>
                      ) : null}

                      <TableRow className={classes.paginationTableRow}>
                        <TablePagination
                          className={classes.paginationTableCell}
                          colSpan={7}
                          rowsPerPageOptions={[10, 25]}
                          count={requestStore.requestsCount}
                          rowsPerPage={limit}
                          page={page}
                          onPageChange={(_event, page) => setPage(page)}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </LoadingBox>
            </>
          )}
        </Box>
      </DrawerPage>
    </>
  );
};

export default DashboardPage;
