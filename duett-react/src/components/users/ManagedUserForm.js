import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  useTheme,
  Grid,
  Typography,
  TextField,
  Box,
  IconButton,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from '../layout/FlexBox';
import ax from '../../lib/api';
import TrashIcon from '../../components/icons/TrashIcon';
import LoadingButton from '../forms/LoadingButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import debounce from 'lodash.debounce';

const ManagedUserForm = ({ user }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const [foundUser, setFoundUser] = useState();
  const [searchValue] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      let res = await ax.get(`/api/users/${user.id}/managed-users/`);
      if (res.status === 200) {
        setUsers(res.data);
      }
    } catch (e) {
      alert('There was an error adding this user.');
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let res = await ax.post(`/api/users/${user.id}/managed-users/`, {
        user_id: foundUser.id,
      });
      if (res.status === 201) {
        await loadUsers();
      }
    } catch (e) {
      alert('There was an error adding this user.');
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    try {
      let res = await ax.delete(`/api/users/${user.id}/managed-users/${id}/`);
      if (res.status === 204) {
        loadUsers();
      }
    } catch (e) {
      alert('There was an error removing this user.');
    }
  };

  const searchUsers = useCallback(async () => {
    if (searchInput) {
      try {
        setSearchLoading(true);
        const res = await ax.get(`/api/users/?search=${searchInput}`);
        if (res.status === 200) {
          setOptions(res.data);
        } else {
          setOptions([]);
        }
        setSearchLoading(false);
      } catch (err) {
        console.log('err', err.message);
      }
    }
  }, [searchInput]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    const delayedSearch = debounce(searchUsers, 200);
    delayedSearch();

    return () => {
      delayedSearch.cancel();
    };
  }, [searchInput, searchUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <Grid container>
      <Box mb={6}>
        {users.map((managedUser) => {
          return (
            <FlexBox alignItems="center">
              <Typography variant="body2" style={{ marginRight: 16 }}>
                {managedUser.managed_user.email}
              </Typography>
              <IconButton onClick={() => removeUser(managedUser.id)}>
                <TrashIcon />
              </IconButton>
            </FlexBox>
          );
        })}
      </Box>

      <Grid container item xs={12}>
        <Grid item xs={12} md={5}>
          <Autocomplete
            id="search"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            options={options}
            loading={searchLoading}
            value={searchValue}
            onChange={(event, value) => {
              setFoundUser(value);
            }}
            onInputChange={(event, value) => {
              setSearchInput(value);
            }}
            getOptionLabel={(option) => {
              return `${option.user_profile.first_name} ${option.user_profile.last_name}`;
            }}
            renderOption={(option) => {
              return (
                <Box>
                  <Typography variant="body1">
                    {option.user_profile.first_name}{' '}
                    {option.user_profile.last_name}
                  </Typography>
                  <Typography variant="body2">{option.email}</Typography>
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add User"
                placeholder="Search Name"
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <FlexBox>
          <Button
            variant="text"
            color="primary"
            disableElevation={true}
            onClick={() => window.history.back()}
            style={{ marginRight: theme.spacing(2) }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            variant="contained"
            color="primary"
            disableElevation={true}
            type={'submit'}
            onClick={handleSubmit}
          >
            Save
          </LoadingButton>
        </FlexBox>
      </Grid>
    </Grid>
  );
};

ManagedUserForm.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ManagedUserForm;
