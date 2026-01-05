import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { isNumber } from '../../../lib/helpers';
import ax from '../../../lib/api';
import { useLocation } from 'wouter';
import useAuthStore from '../../../store/auth';
import useCareRequestStore from '../../../store/careRequests';

const useStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
}));

const TwoFactorAuthQR = ({ base32, auth_url, user_id }) => {
  const styles = useStyles();
  const [qrcodeUrl, setqrCodeUrl] = useState('');
  const [verifyCode, setCode] = useState('');
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);

  const [, setLocation] = useLocation();
  const [getUserInformation, logout] = useAuthStore((state) => [
    state.getUserInformation,
    state.logout,
  ]);
  const [clearOutFilter] = useCareRequestStore((state) => [
    state.clearOutFilter,
  ]);

  const handleCodeChange = (e) => {
    const inputValue = e.target.value;
    if (
      (isNumber(inputValue) || inputValue.length === 0) &&
      inputValue.length < 7
    ) {
      setError(false);
      setCode(e.target.value);
    }
  };

  const handleLogout = () => {
    logout();
    clearOutFilter();
    setLocation('/');
  };

  const handleVerifyCode = (user_id, token) => {
    if (!token) {
      setError('Please provide the authentication code to complete your login');
      return;
    }
    setLoader(true);
    ax.post('/api/2fa/verify-qr/', { user_id, token })
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
        setLoader(false);
      });
  };

  useEffect(() => {
    if (auth_url) {
      QRCode.toDataURL(auth_url)
        .then(setqrCodeUrl)
        .catch((e) => {
          console.log(e);
        });
    }
  }, [auth_url]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        height="100vh"
      >
        <Box className={styles.paper}>
          <Typography variant="h6">Scan QR Code</Typography>
          <Grid container justifyContent="center">
            <Grid item>
              <img
                className={styles.image}
                src={qrcodeUrl}
                alt="Duett APP QR"
              />
            </Grid>
          </Grid>
        </Box>
        <Box className={styles.paper}>
          <Box>
            <Typography variant="h6">
              Or Enter SecretKey Below into Microsoft Authenticator
            </Typography>
            <Typography
              variant="body2"
              style={{ color: 'black', padding: '10px', marginBottom: '20px' }}
            >
              <span style={{ fontWeight: 'bolder' }}> SecretKey: </span>{' '}
              {base32}
</Typography>
display="flex";
          flexDirection="column"
          alignItems="center"
          width={300}
        >
          <Typography variant="h6">Verify Code</Typography>
          <Typography
            variant="body2"
            style={{
              marginBottom: '10px',
              color: 'black',
              textAlign: 'center',
            }}
          >
            Enter the code provided by Microsoft Authenticator after scanning
            the QR code or entering the <b>SecretKey</b> in that app.
          </Typography>
        </Box>
        <Box width={220} marginBottom={0}>
          <TextField
            placeholder="code"
            type="text"
            error={!!error}
            helperText={error}
            value={verifyCode}
            onChange={handleCodeChange}
            variant="outlined"
            size="small"
            required
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          style={{ marginBottom: '10px', marginTop: '-20px' }}
          onClick={() => handleVerifyCode(user_id, verifyCode)}
          disabled={loader}
        >
          {loader ? <CircularProgress /> : 'Submit'}
        </Button>

        <Typography variant="body2">
          <span
            style={{
              color: 'black',
              textDecoration: 'underline',
              cursor: 'pointer',
              textAlign: 'center',
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
            onClick={() => window.open('https://www.duett.io/faqs-3', '_blank')}
          >
            Need help?
          </span>
        </Typography>
      </Box>
    </>
  );
};

export default TwoFactorAuthQR;
