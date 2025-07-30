import React, { useState } from 'react';
import { makeStyles, Typography, Modal, Button, Box } from '@material-ui/core';
import clsx from 'clsx';
import { useLocation } from 'wouter';
import theme from '../../theme';
import ax from '../../lib/api';
import useAuthStore from '../../store/auth';
import Agency2FAOptions from '../../views/authentication/Agency2FAOption';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 580,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.blue.main}`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(6, 12),
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)',
      padding: '48px 20px',
    },
  },
  modalWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)', // Adjust the opacity value as needed
  },
  title: {
    marginBottom: 50,
    textAlign: 'center',
  },
}));

const UserPromptModal = ({ open, provider }) => {
  const classes = useStyles();
  const [, setLocation] = useLocation();
  const [loader, setLoader] = useState(false);
  const [getUserInformation, user] = useAuthStore((state) => [
    state.getUserInformation,
    state.user,
  ]);

  const handleConfigure = (provider) => {
    if (provider) {
      setLocation('/configure-2FA');
    }
  };

  const handlePrompt = () => {
    setLoader(true);
    ax.post('/api/2fa/prompt-provider/', {
      user_id: user.id,
    })
      .then(async (response) => {
        localStorage.removeItem('verified');
        await getUserInformation();
        setLocation('/');
      })
      .catch((error) => {
        setLocation('/');
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <Modal open={open} className={classes.modalWrapper}>
      <div className={classes.paper}>
        {!provider ? (
          <Agency2FAOptions />
        ) : (
          <>
            <Typography
              variant="h6"
              gutterBottom
              style={{ marginBottom: '20px' }}
              className={clsx(classes.title)}
            >
              Do you wish to secure your account with text message (SMS)
              two-factor authentication?
            </Typography>
            <Typography variant="body2" gutterBottom>
              We will ask you again in 2 weeks if you opt-out of two-factor
              authentication.
            </Typography>
            <Box
              display="flex"
              justifyContent="center"
              align="center"
              sx={{ mt: 4 }}
            >
              <Button
                onClick={handlePrompt}
                variant="contained"
                color="secondary"
                disabled={loader}
                disableElevation
                style={{
                  marginBottom: theme.spacing(2),
                  marginRight: '20px',
                }}
              >
                No
              </Button>
              <Button
                onClick={() => handleConfigure(provider)}
                variant="contained"
                color="primary"
                disabled={loader}
                disableElevation
                style={{ marginBottom: theme.spacing(2) }}
              >
                Yes
              </Button>
            </Box>
          </>
        )}
      </div>
    </Modal>
  );
};

export default UserPromptModal;
