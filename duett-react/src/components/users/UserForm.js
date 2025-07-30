import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  useTheme,
  FormHelperText,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import DuettTextField from '../forms/DuettTextField';
import { useLocation, useRoute } from 'wouter';
import PlainInput from '../forms/PlainInput';
import PlainInputLabel from '../forms/PlainInputLabel';
import FlexBox from '../layout/FlexBox';
import ax from '../../lib/api';
import { USStateAbbreviations as USStates } from '../../lib/USStates';
import LoadingButton from '../forms/LoadingButton';
import useAuthStore from '../../store/auth';
import {
  accountTypes,
  roles,
  useAccountType,
  useRole,
} from '../../hooks/useRole';
import useCareRequestStore from '../../store/careRequests';

const initialUserData = {
  email: '',
  group: '',
};

const initialProfileData = {
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

const initialUserErrors = {
  email: '',
  group: '',
};

const initialProfileErrors = {
  first_name: '',
  last_name: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

const UserForm = ({ user }) => {
  const theme = useTheme();
  const [updatingSelf] = useRoute('/users/self');
  const role = useRole();
  const accountType = useAccountType();

  const isAgency = accountType === accountTypes.AGENCY;

  const [loading, setLoading] = useState(false);

  const [, setLocation] = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const currentUser = useAuthStore((state) => state.user);

  const [userData, setUserData] = useState(initialUserData);
  const [userErrors, setUserErrors] = useState(initialUserErrors);

  const [profileData, setProfileData] = useState(initialProfileData);
  const [profileErrors, setProfileErrors] = useState(initialProfileErrors);
  const addressHasError =
    profileErrors?.address ||
    profileErrors?.state ||
    profileErrors?.city ||
    profileErrors?.zip;
  const [getCityStateFromZip] = useCareRequestStore((store) => [
    store.getCityStateFromZip,
  ]);

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleProfileDataChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleGetLocation = async (e) => {
    const zipcode = e.target.value;
    if (zipcode) {
      const { state, city } = await getCityStateFromZip(zipcode);
      if (USStates.includes(state)) {
        setProfileData({ ...profileData, state, city });
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setUserErrors(initialUserErrors);
      setProfileErrors(initialProfileErrors);

      const payload = {
        ...userData,
        user_profile: profileData,
      };

      let res;
      if (user) {
        res = await ax.patch(`/api/users/${user.id}/`, payload);
      } else {
        res = await ax.post('/api/users/', payload);
      }
      if (res?.status === 201) {
        alert('User has been created.');
        setLocation('/users');
      } else if (res?.status === 200) {
        alert('User has been updated.');
        if (updatingSelf) {
          setUser(res.data);
        }
      }
    } catch (e) {
      console.log(e);
      if (user) {
        alert('There was an error updating this user. Please try again.');
      } else {
        alert('There was an error creating a new user. Please try again.');
      }
      const errors = e.response.data;
      setUserErrors(errors);
      setProfileErrors(errors.user_profile);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUserData(user);
      setProfileData(user.user_profile);
    }
  }, [user]);

  const agencyOptions = [
    'Care Agency Admin',
    'Care Manager Supervisor',
    'Care Manager',
  ];

  const providerOptions = ['Care Provider', 'Care Provider Admin'];

  let groupOptions = isAgency ? [...agencyOptions] : providerOptions;

  const { AGENCY_SUPERVISOR, AGENCY_ADMIN, PROVIDER_ADMIN } = roles;
  let permission = false;

  if ([AGENCY_ADMIN, PROVIDER_ADMIN].includes(role)) {
    permission = true;
  } else if (role === AGENCY_SUPERVISOR && user?.id !== currentUser?.id) {
    if (user?.group === AGENCY_ADMIN) {
      permission = false;
    } else {
      permission = true;
      const modifiedOptions = [...agencyOptions];
      modifiedOptions.shift();
      groupOptions = modifiedOptions;
    }
  } else {
    permission = false;
  }

  return (
    <Grid container>
      <Grid container item xs={12}>
        <Grid item xs={12} md={5}>
          <DuettTextField
            label="First Name"
            id="first-name"
            name="first_name"
            value={profileData?.first_name}
            onChange={handleProfileDataChange}
            error={!!profileErrors?.first_name}
            helperText={profileErrors?.first_name}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <DuettTextField
            label="Last Name"
            id="last-name"
            name="last_name"
            value={profileData?.last_name}
            error={!!profileErrors?.last_name}
            helperText={profileErrors?.last_name}
            onChange={handleProfileDataChange}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <DuettTextField
            label="Email"
            id="email"
            name="email"
            value={userData.email}
            error={!!userErrors.email}
            helperText={userErrors.email}
            onChange={handleUserDataChange}
          />
        </Grid>

        <Grid item xs={12} md={5}>
          <DuettTextField
            label="Phone"
            id="phone"
            name="phone"
            value={profileData?.phone}
            error={!!profileErrors?.phone}
            helperText={profileErrors?.phone}
            onChange={handleProfileDataChange}
          />
        </Grid>

        <Grid container item xs={12}>
          <Grid item xs={12} md={5}>
            <DuettTextField
              label="Address"
              id="street"
              name="address"
              placeholder="Street Address"
              value={profileData?.address}
              error={!!addressHasError}
              helperText={
                addressHasError ? 'There is an error in your address.' : ''
              }
              onChange={handleProfileDataChange}
            />
          </Grid>
          <Grid item xs={12} md={7}>
            <Box display="flex" flexDirection="row" alignItems="center">
              <PlainInput
                id="zip"
                placeholder="Zip"
                name="zip"
                value={profileData?.zip}
                onChange={handleProfileDataChange}
                style={{ flex: 1 }}
                inputProps={{ onBlur: handleGetLocation }}
              />

              <PlainInput
                id="city"
                placeholder="City"
                name="city"
                value={profileData?.city}
                onChange={handleProfileDataChange}
                style={{ flex: 2 }}
              />

              <Box>
                <Select
                  id="state"
                  disableUnderline={true}
                  name="state"
                  value={profileData?.state}
                  onChange={handleProfileDataChange}
                  displayEmpty
                >
                  <MenuItem disabled value="">
                    State
                  </MenuItem>
                  {USStates.map((name, i) => {
                    return (
                      <MenuItem value={name} key={`${name}_${i}`}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Grid container item xs={12}>
          <Grid item xs={12} md={5}>
            <FormControl error={!!userErrors.group}>
              <PlainInputLabel>Role</PlainInputLabel>
              <Select
                id="group"
                disableUnderline={true}
                name="group"
                value={userData.group}
                error={!!userErrors.group}
                onChange={handleUserDataChange}
                disabled={!permission}
              >
                <MenuItem value={null} disabled selected>
                  Role
                </MenuItem>
                {groupOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              {userErrors.group && (
                <FormHelperText>{userErrors.group}</FormHelperText>
              )}
            </FormControl>
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
    </Grid>
  );
};

UserForm.propTypes = {
  user: PropTypes.object,
};

export default UserForm;
