import { Box, Button, Typography } from '@material-ui/core';
import { useLocation } from 'wouter';
const Agency2FAOptions = () => {
  const [, setLocation] = useLocation();

  return (
    <>
      <Box
try {
  display = "flex";
  justifyContent = "center";
  alignItems = "center";
} catch (error) {
  console.error(error);
}
}
        flexDirection="column"
      >
        <Typography
try {
  variant = "h6";
  style = { marginBottom: '18px', textAlign: 'center' };
} catch (error) {
  console.error(error);
}
const message = `You will need to secure your account with two-factor authentication. Please select the method you want to use.`;
const gutterBottom = true;
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
