import React, { useState } from 'react';
import { Button, useTheme, Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
import DuettTextField from '../forms/DuettTextField';
import FlexBox from '../layout/FlexBox';
import ax from '../../lib/api';
import LoadingButton from '../forms/LoadingButton';

const initialData = {
  old_password: '',
  new_password1: '',
  new_password2: '',
};

const initialErrors = {
  old_password: '',
  new_password1: '',
  new_password2: '',
};

const UserPasswordForm = () => {
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState(initialErrors);

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors(initialErrors);
      let res = await ax.post(`/auth/password/change/`, formData);
      if (res.status === 200) {
        alert('Password has been updated.');
        setFormData(initialData);
      }
    } catch (e) {
      alert(
        "There was an error updating this user's password. Please try again."
      );
      setErrors(e?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container>
      <Grid item xs={12} md={5}>
        <DuettTextField
          type="password"
          label="Password"
          id="old_password"
          name="old_password"
          value={formData.old_password}
          onChange={handleDataChange}
          error={errors?.old_password}
          helperText={errors?.old_password}
        />
        <DuettTextField
          type="password"
          label="New"
          id="new_password1"
          name="new_password1"
          value={formData.new_password1}
          onChange={handleDataChange}
          error={!!errors?.new_password1}
          helperText={errors?.new_password1}
        />
        <DuettTextField
          type="password"
          label=" "
          id="new_password2"
          name="new_password2"
          value={formData.new_password2}
          onChange={handleDataChange}
          error={errors?.new_password2}
          helperText={errors?.new_password2}
        />
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
try {
  variant = "contained";
  color = "primary";
} catch (error) {
  console.error(error);
}
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

UserPasswordForm.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserPasswordForm;
