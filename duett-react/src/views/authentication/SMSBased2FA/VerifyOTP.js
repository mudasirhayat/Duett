import React, { useState, useEffect } from 'react';
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
import { calculateTimeDiff, isNumber } from '../../../lib/helpers';

const VerifyOTP = () => {
  const [verifyOTP, setVerifyOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [otploading, setOtpLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [timer, setTimer] = useState({ minutes: null, seconds: null });
  const [getUserInformation, user, logout] = useAuthStore((state) => [
    state.getUserInformation,
    state.user,
    state.logout,
  ]);
  const [clearOutFilter] = useCareRequestStore((state) => [
    state.clearOutFilter,
  ]);

  const [, setLocation] = useLocation();

  const expiration = localStorage.getItem('expiration');

  useEffect(() => {
    if (!expiration) {
      handleResendOTP();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(calculateTimeDiff(expiration));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [expiration]);

  const handleResendOTP = () => {
    setOtpLoading(true);
    setVerifyOTP('');
    setError('');
    setErrorText('');
    const user_id = user.id;
    ax.post('/api/2fa/configure-otp/', { user_id })
      .then((response) => {
        const { expiration } = response.data;
        localStorage.setItem('expiration', expiration);
      })
      .catch((error) => {
        setOtpLoading(false);
      });
  };

  const handleVerifyOTP = (user_id, otp) => {
    if (!verifyOTP) {
      setError(true);
      setErrorText(
        'Please provide the authentication code to complete your login'
      );
      return;
    }
    setLoading(true);
    ax.post('/api/2fa/verify-otp/', { user_id, otp })
      .then(async (response) => {
        localStorage.removeItem('expiration');
        localStorage.removeItem('configure');
        localStorage.setItem('verified', response.data.expiration);
        await getUserInformation();
        setLocation('/');
      })
      .catch((error) => {
        setError(true);
        setErrorText(error.response.data.message);
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
      setError(false);
      setErrorText('');
      setVerifyOTP(e.target.value);
    }
  };

  const handleLogout = () => {
    logout();
    clearOutFilter();
    setLocation('/');
  };

  const timerNull = timer.minutes === null && timer.seconds === null;
  const timerExpired = timer.minutes === 0 && timer.seconds === 0;
  const nan = isNaN(timer.minutes);

  useEffect(() => {
    setOtpLoading(false);
  }, [timerExpired, expiration]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box textAlign="center" width={400}>
        <Typography variant="h6" gutterBottom>
          Enter the 6-digit code you received via text message to confirm your
          two-factor configuration
        </Typography>
        <TextField
          placeholder="code"
          type="text"
          error={!!error}
          helperText={errorText}
          value={verifyOTP}
          onChange={handleOTPChange}
          variant="outlined"
          size="small"
          fullWidth
          autoFocus
          required
        />
        {!timerNull && !nan && !loading && !otploading ? (
          <>
            {!timerExpired && (
              <Typography variant="body2" style={{ marginBottom: '20px' }}>
                OTP will expire in{' '}
                <span style={{ color: 'black', textDecoration: 'underline' }}>
                  {timer.minutes} minutes {timer.seconds} seconds
                </span>
              </Typography>
            )}
            {!timerExpired && (
              <Button
                variant="contained"
                color="primary"
                style={{ marginBottom: '20px', width: '80%' }}
                onClick={() => handleVerifyOTP(user.id, verifyOTP)}
                sx={{ mt: 2 }}
              >
                Verify Phone Number
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              style={{ marginBottom: '20px', width: '80%' }}
              onClick={handleResendOTP}
              sx={{ mt: 2 }}
            >
              Send New Code
            </Button>
          </>
        ) : (
          <CircularProgress sx={{ mt: 2 }} />
        )}
        <Typography variant="body2">
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
      </Box>
    </Box>
  );
};

export default VerifyOTP;
