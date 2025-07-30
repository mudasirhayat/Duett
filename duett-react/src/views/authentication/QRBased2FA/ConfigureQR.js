import { useEffect, useState } from 'react';
import ax from '../../../lib/api';
import { Box, CircularProgress } from '@material-ui/core';
import TwoFactorAuthQR from './TwoFactorAuthQR';
import useAuthStore from '../../../store/auth';

const ConfigureQR = () => {
  const [loader, setLoader] = useState(false);
  const [secret, setSecret] = useState({
    auth_url: '',
    base32: '',
  });

  const [user] = useAuthStore((state) => [state.user]);

  const handleGenerateQR = (id) => {
    setLoader(true);
    ax.post('/api/2fa/generate-qr/', { user_id: id })
      .then((response) => {
        setSecret({
          base32: response.data.base32,
          auth_url: response.data.auth_url,
        });
      })
      .catch((error) => {
        if (error) {
          console.log(error.response);
        }
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    handleGenerateQR(user.id);
  }, []);

  return (
    <>
      {!loader ? (
        <TwoFactorAuthQR
          base32={secret.base32}
          auth_url={secret.auth_url}
          user_id={user.id}
        />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress sx={{ mt: 2 }} />
        </Box>
      )}
    </>
  );
};

export default ConfigureQR;
