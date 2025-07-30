import React from 'react';
import { Button, Typography, Link, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'wouter';
import useAuthStore from '../../store/auth';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    textAlign: 'center',
    maxWidth: 400,
    width: '100%',
  },
  heading: {
    marginBottom: theme.spacing(2),
  },
  bodyText: {
    marginBottom: theme.spacing(2),
  },
  link: {
    display: 'block',
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontSize: 14,
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    marginTop: theme.spacing(4),
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  listContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'left',
    height: '100px', // Fixed height for the container
    overflowY: 'auto', // Enable vertical scrolling when overflowing
  },
  stepIndicator: {
    marginTop: theme.spacing(4),
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
}));

const Step6 = () => {
  const classes = useStyles();
  const [, setLocation] = useLocation();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    const email = localStorage.getItem('signup_email');
    const password = localStorage.getItem('signup_password');

    if (email && password) {
      try {
        await login(email, password);

        // Clear the stored credentials after a successful login
        localStorage.removeItem('signup_email');
        localStorage.removeItem('signup_password');

        // Redirect to the dashboard
        setLocation('/');
      } catch (err) {
        console.error('Login failed:', err);
      }
    } else {
      console.error('No stored credentials found');
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h6" className={classes.heading}>
          Congratulations! Your Duett Account is now set up.
        </Typography>
        <Typography variant="body1" className={classes.bodyText}>
          You can now access the dashboard in Duett and review open cases.
          However, there are still a few steps before you will be able to notify
          for available cases:
        </Typography>

        <Box className={classes.listContainer}>
          <Typography variant="body2" className={classes.bodyText}>
            1) Duett needs to verify the document you submitted and
            funding/services/counties.
            <br />
            2) Duett needs to send your first invoice for payment.
          </Typography>
        </Box>

        <Typography variant="body1" className={classes.bodyText}>
          Once these steps are complete and we receive your subscription
          payment, we will fully activate your account.
        </Typography>
        <Typography variant="body2" className={classes.bodyText}>
          In the meantime, watch this onboarding video to get up to speed
          quickly:
        </Typography>

        <Link
          href="https://www.duett.io/getting-started-providers"
          target="_blank"
          className={classes.link}
        >
          Getting Started
        </Link>

        <Button
          variant="contained"
          className={classes.button}
          onClick={handleLogin} // Trigger login and redirect on button click
        >
          To My Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Step6;
