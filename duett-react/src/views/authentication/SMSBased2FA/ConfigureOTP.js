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

const ConfigureOTP = () => {
  const [, setLocation] = useLocation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, logout] = useAuthStore((state) => [state.user, state.logout]);
  const [clearOutFilter] = useCareRequestStore((state) => [
    state.clearOutFilter,
  ]);

  const handleConfigureOTP = () => {
    const phone = phoneNumber.replace(/\D/g, '');
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    } else if (!(phone.length === 10)) {
      setError('US numbers should be 10 digits');
      return;
    }
    setLoading(true);
    setError('');
    const user_id = user.id;
    ax.post('/api/2fa/configure-otp/', {
      user_id,
      phone_number: phone,
    })
      .then((response) => {
        const { expiration } = response.data;
        localStorage.setItem('configure', 'in progress');
        localStorage.setItem('expiration', expiration);
        window.location = '/verify-otp';
      })
      .catch((error) => {
        if (error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError('Invalid phone number. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNumberChange = (e) => {
    setError('');
    const inputValue = e.target.value;
    const formattedNumber = formatPhoneNumber(inputValue);

    setPhoneNumber(formattedNumber);
  };

  const formatPhoneNumber = (phoneNumber) => {
    let formatted = phoneNumber.replace(/\D/g, '');

    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }
    if (formatted.length > 0) {
      formatted = '(' + formatted;
    }
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4) + ') ' + formatted.slice(4);
    }
    if (formatted.length > 9) {
      formatted = formatted.slice(0, 9) + '-' + formatted.slice(9);
    }

    return formatted;
  };

  const handleLogout = () => {
    logout();
    clearOutFilter();
    setLocation('/');
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box textAlign="center" sx={{ m: 5 }} width={400}>
          <Typography variant="h6" gutterBottom>
            Enter your 10-digit mobile phone number to receive a code via text
            message
          </Typography>
          <TextField
            placeholder="Phone Number"
            variant="outlined"
            value={phoneNumber}
            onChange={handleNumberChange}
            sx={{ mb: 2 }}
            error={!!error}
            helperText={error}
            fullWidth
            autoFocus
            required
          />
          {!loading ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfigureOTP}
              size="large"
            >
              Send code
            </Button>
          ) : (
            <CircularProgress sx={{ mt: 2 }} />
          )}
          <Typography variant="body2" style={{ marginTop: '20px' }}>
            <span
              style={{
                color: 'black',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={handleLogout}
            >
              Back to Login
            </span>
          </Typography>
          <Typography variant="body2" style={{ marginTop: '20px' }}>
            <span
              style={{
                color: 'black',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() =>
                window.open('https://www.duett.io/faqs-3', '_blank')
              }
            >
              Need help?
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default ConfigureOTP;
