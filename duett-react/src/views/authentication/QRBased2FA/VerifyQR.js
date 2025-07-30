import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import ax from '../../../lib/api';
import { useLocation } from 'wouter';
import useAuthStore from '../../../store/auth';
import useCareRequestStore from '../../../store/careRequests';
import { isNumber } from '../../../lib/helpers';

const VerifyQR = () => {
  const [verifyOTP, setVerifyOTP] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [getUserInformation, user, logout] = useAuthStore((state) => [
    state.getUserInformation,
    state.user,
    state.logout,
  ]);
  const [clearOutFilter] = useCareRequestStore((state) => [
    state.clearOutFilter,
  ]);

  const [, setLocation] = useLocation();

  const handleValidateOTP = (user_id, token) => {
    if (!token) {
      setError('Please provide the authentication code to complete your login');
      return;
    }
    setLoading(true);
    ax.post('/api/2fa/validate-qr/', { user_id, token })
      .then(async (response) => {
        localStorage.setItem('verified', new Date());
        await getUserInformation();
        setLocation('/');
      })
      .catch((error) => {
        if (error.response?.data?.message) {
          setError(error.response.data.message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOTPChange = (e) => {
    const inputValue = e.target.value;
    if (
      (isNumber(inputValue) || inputValue.length === 0) &&
      inputValue.length < 7
    ) {
      setError('');
      setVerifyOTP(e.target.value);
    }
  };

  const handleDisable2FA = (user_id) => {
    ax.post('/api/2fa/disable-qr/', { user_id })
      .then(async (response) => {
        localStorage.removeItem('verified');
        await getUserInformation();
        setLocation('/configure-qr');
      })
      .catch((error) => {
        setLocation('/');
      });
  };

  const handleLogout = () => {
    logout();
    clearOutFilter();
    setLocation('/');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box textAlign="center" width={300}>
        <Typography style={{ marginBottom: '20px' }} variant="h6">
          Enter Authenticator App code:
        </Typography>
        <Box>
          <TextField
            placeholder="code"
            type="text"
            error={!!error}
            helperText={error}
            value={verifyOTP}
            onChange={handleOTPChange}
            variant="outlined"
            fullWidth
            required
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleValidateOTP(user.id, verifyOTP)}
          disabled={loading}
        >
          {loading ? <CircularProgress /> : 'Authenticate'}
        </Button>
        <Typography variant="body2" style={{ marginTop: '40px' }}>
          <span
            style={{
              color: 'black',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={handleLogout}
          >
            Log in with another account
          </span>
        </Typography>
        <Typography variant="body2" style={{ marginTop: '20px' }}>
          <span
            style={{
              color: 'red',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => handleDisable2FA(user.id)}
          >
            Account deleted? Configure 2FA again
          </span>
        </Typography>
      </Box>
    </Box>
  );
};

export default VerifyQR;
