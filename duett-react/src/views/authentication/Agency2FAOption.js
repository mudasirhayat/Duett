import { Box, Button, Typography } from '@material-ui/core';
import { useLocation } from 'wouter';
const Agency2FAOptions = () => {
  const [, setLocation] = useLocation();

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography
          variant="h6"
          style={{ marginBottom: '18px', textAlign: 'center' }}
          gutterBottom
        >
          You will need to secure your account with two-factor authentication.
          Please select the method you want to use.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ width: '60%', maxWidth: '250px' }}
          onClick={() => {
            setLocation('/configure-2FA');
          }}
        >
          SMS
        </Button>
        <Typography
          variant="body2"
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          OR
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          style={{ width: '60%', maxWidth: '250px' }}
          onClick={() => {
            setLocation('/configure-qr');
          }}
        >
          Microsoft Authenticator App
        </Button>
      </Box>
    </>
  );
};

export default Agency2FAOptions;
