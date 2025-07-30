import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Link,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from '@material-ui/core';
import DrawerPage from '../../components/app/DrawerPage';
import FlexBox from '../../components/layout/FlexBox';
import PlainInput from '../../components/forms/PlainInput';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import useUserStore from '../../store/users';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import LoadingBox from '../../components/layout/LoadingBox';
import { formatDate } from '../../lib/dates';
import { useLocation } from 'wouter';
import ToggleColumnLabel from '../../components/dashboard/ToggleColumnLabel';
import ax from '../../lib/api';

const useStyles = makeStyles((theme) => ({
  input: {
    width: 300,
  },
  creationDateCell: {
    backgroundColor: '#f2f2f2',
  },
  checkbox: {
    padding: 0,
    marginRight: theme.spacing(2),
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
  link: {
    cursor: 'pointer',
  },
  searchIcon: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}));

const UsersPage = () => {
  const classes = useStyles();
  const theme = useTheme();

  const [, setLocation] = useLocation();

  const {
    users,
    loadUsers,
    loadingUsers: loading,
    usersCount,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    sort,
    setSort,
  } = useUserStore();

  const [searchInput, setSearchInput] = useState(search);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isApproved, setIsApproved] = useState(null); // Approval status state
  const [loadingApprovalStatus, setLoadingApprovalStatus] = useState(true); // Loading state for approval check
  const [error, setError] = useState(null); // Error handling state

  useEffect(() => {
    const fetchApprovalStatus = async () => {
      try {
        setLoadingApprovalStatus(true);
        const response = await ax.get('/api/users/dashboard-view/');
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
    if (isApproved) {
      loadUsers();
    }
  }, [loadUsers, page, limit, search, sort, isApproved]);

  function handleChangeRowsPerPage(event) {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  }

  function searchUser(value) {
    setSearch(value);
    setPage(0);
  }

  function handleSearchKeyPress(event) {
    if (event.key === 'Enter') {
      searchUser(event.target.value);
    }
  }

  async function activateUsers() {
    try {
      let res = await ax.post('/api/users/activate/', {
        user_ids: selectedUsers,
      });
      if (res.status === 200) {
        loadUsers();
        setSelectedUsers([]);
      }
    } catch (e) {
      console.log(e);
      alert('There was an error activating these users.');
    }
  }

  async function deactivateUsers() {
    try {
      let res = await ax.post('/api/users/deactivate/', {
        user_ids: selectedUsers,
      });
      if (res.status === 200) {
        loadUsers();
        setSelectedUsers([]);
      }
    } catch (e) {
      alert('There was an error deactivating these users.');
    }
  }

  function toggleUserSelected(e, id) {
    const checked = e.target.checked;
    if (checked) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      const index = selectedUsers.indexOf(id);
      let updatedUsers = [...selectedUsers];
      updatedUsers.splice(index, 1);
      setSelectedUsers(updatedUsers);
    }
  }

  if (loadingApprovalStatus) {
    return <LoadingBox loading={true} />;
  }

  if (error) {
    return <Box>{error}</Box>;
  }

  return (
    <DrawerPage>
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
            <FlexBox justifyContent="space-between" mb={4}>
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
                        onClick={() => searchUser(searchInput)}
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
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: theme.spacing(1) }}
                  disableElevation
                  onClick={() => setLocation('/users/new')}
                >
                  <AddIcon fontSize="small" />
                  Add User
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: theme.spacing(1) }}
                  disableElevation
                  onClick={activateUsers}
                >
                  <CheckBoxIcon />
                  Activate
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginRight: theme.spacing(1) }}
                  disableElevation
                  onClick={deactivateUsers}
                >
                  <CloseIcon />
                  Deactivate
                </Button>
              </FlexBox>
            </FlexBox>

            <LoadingBox loading={loading}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <ToggleColumnLabel
                          sortLabel="userprofile__last_name"
                          sort={sort}
                          setSort={setSort}
                          label="User Name"
                        />
                      </TableCell>
                      <TableCell>
                        <ToggleColumnLabel
                          sortLabel="groups__name"
                          sort={sort}
                          setSort={setSort}
                          label="Role Name"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <ToggleColumnLabel
                          sortLabel="updated_at"
                          sort={sort}
                          setSort={setSort}
                          label="Last Updated"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <ToggleColumnLabel
                          sortLabel="created_at"
                          sort={sort}
                          setSort={setSort}
                          label="Creation Date"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <ToggleColumnLabel
                          sortLabel="is_active"
                          sort={sort}
                          setSort={setSort}
                          label="Account Status"
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={`User_${user.id}`}>
                        <TableCell component="th" scope="row">
                          <FlexBox alignItems="center">
                            <Checkbox
                              className={classes.checkbox}
                              checked={selectedUsers.includes(user.id)}
                              onChange={(e) => toggleUserSelected(e, user.id)}
                              inputProps={{ 'aria-label': 'select all users' }}
                            />
                            <Link
                              className={classes.link}
                              onClick={() => setLocation(`/users/${user.id}`)}
                            >
                              {`${user.user_profile?.first_name} ${user.user_profile?.last_name}`}
                            </Link>
                          </FlexBox>
                        </TableCell>
                        <TableCell>{user.group}</TableCell>
                        <TableCell align="right">
                          {formatDate(user.updated_at)}
                        </TableCell>
                        <TableCell
                          align="right"
                          className={classes.creationDateCell}
                        >
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell align="right">
                          {user.is_active ? 'Active' : 'Inactive'}
                        </TableCell>
                      </TableRow>
                    ))}

                    {usersCount < 1 && !loading ? (
                      <TableRow>
                        <TableCell colSpan="7">No Matching Users</TableCell>
                      </TableRow>
                    ) : null}

                    <TableRow className={classes.paginationTableRow}>
                      <TablePagination
                        className={classes.paginationTableCell}
                        colSpan={7}
                        rowsPerPageOptions={[10, 25]}
                        count={usersCount}
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
  );
};

UsersPage.propTypes = {};

UsersPage.defaultProps = {};

export default UsersPage;
