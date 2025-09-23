import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  FormHelperText,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAuthStore from '../../store/auth';
import useSignupStore from '../../store/signup';
import shallow from 'zustand/shallow';
import LoadingBox from '../../components/layout/LoadingBox';
import logo from '../../assets/duett-logo.svg';
import { useLocation } from 'wouter';
import ax from '../../lib/api';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeft: `10px solid ${theme.palette.secondary.main}`,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 240,
  },
  logo: {
    marginBottom: theme.spacing(8),
  },
  formControl: {
    marginBottom: 24,
  },
  submitButton: {
    marginBottom: 36,
    color: 'white',
  },
  input: {
    marginRight: 0,
  },
  helperText: {
    marginLeft: 0,
    marginRight: 0,
  },
}));

const Login = ({ notLoggedIn }) => {
  const classes = useStyles();
  const [, setLocation] = useLocation();
  const { isProfileCompleted } = useSignupStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState();
  const [login, checkingAuth] = useAuthStore(
    (state) => [state.login, state.checkingAuth],
    shallow
  );

  const {
    setAuthToken,
    setRefreshToken,
    setProfileData,
    setFundingSources,
    setServices,
    setCounties,
    setDocuments,
    setSignupStep,
    setProfileCompleted,
    setProfileSubmitted,
  } = useSignupStore();

  const toggleForgotPassword = () => setShowForgotPassword(!showForgotPassword);

  useEffect(() => {
    const profileCompletedFromStorage = JSON.parse(
      localStorage.getItem('isProfileCompleted')
    );

    if (profileCompletedFromStorage || profileCompletedFromStorage === false) {
      setLocation('/signup');
    }
  }, [isProfileCompleted, setLocation]);

  async function checkUserSignupStatus(email, password) {
    try {
      // First, get the tokens
      const tokenResponse = await ax.post('/api/token/', { email, password });
      const { access, refresh } = tokenResponse.data;

      // If we get here, tokens are valid. Save them along with email and password
      setAuthToken(access);
      setRefreshToken(refresh);
      localStorage.setItem('signup_email', email);
      localStorage.setItem('signup_password', password);

      // Now, check signup status
      const statusResponse = await ax.post(
        '/api/users/check_user_signup_status/',
        { email, password }
      );
      const { status, step, data } = statusResponse.data;

      // Log the step number received from the backend
      console.log('Step number received from backend:', step);

      if (status === 'Complete signup') {
        // User has completed signup, proceed with normal login
        return true;
      } else if (status === 'Incomplete signup') {
        // Populate localStorage with received data
        const profileData = {
          phone: data.provider_profile?.phone || '',
          first_name: data.provider_profile?.first_name || '',
          last_name: data.provider_profile?.last_name || '',
          company: data.provider_profile?.company || '',
          legalEntity: data.provider_profile?.legalEntity || '',
        };
        setProfileData(profileData);
        setFundingSources(data.funding_sources || []);
        setServices(data.services || []);
        setCounties(data.counties || []);
        setDocuments(data.upload_docs || []);

        // Set signup step to 1 if backend sends 0 or 1
        setSignupStep(step === 0 || step === 1 ? 1 : step);

        // Set isProfileCompleted to false
        setProfileCompleted(false);

        // Explicitly handle the case when step is 0
        if (step === 0) {
          console.log('Step is 0, not setting isProfileSubmitted');
          localStorage.removeItem('isProfileSubmitted');
        } else if (step >= 1) {
          console.log('Step is >= 1, setting isProfileSubmitted to true');
          setProfileSubmitted(true);
        }

        // Refresh the page to restore signup session
        window.location.reload();
        return false;
      }
    } catch (error) {
      console.error('Error checking signup status:', error);
      // If there's an error getting tokens, we'll skip the signup check and proceed with normal login
      return true;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (showForgotPassword) {
      try {
        let res = await ax.post('/auth/password/reset/', {
          email: email,
        });
        if (res.status === 200) {
          setEmailSent(true);
        }
      } catch (e) {
        console.log('err', e.message);
      }
    } else {
      try {
        const signupComplete = await checkUserSignupStatus(email, password);
        if (signupComplete) {
          await login(email, password);
          if (notLoggedIn) {
            window.location.reload();
            return;
          }
          setLocation('/');
        }
      } catch (e) {
        setError(e.message);
      }
    }
  }

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit} className={classes.form}>
<img 
  src={logo} 
  alt="Duett Logo" 
  className={classes.logo} 
/>

<LoadingBox 
  loading={checkingAuth}
/>
          {emailSent ? (
            <Typography className={classes.successMessage}>
              Password reset email has been sent.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column">
              <FormControl className={classes.formControl}>
                <Input
                  id="username-input"
                  placeholder="Email"
                  className={classes.input}
                  disableUnderline={true}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormControl>

              {!showForgotPassword && (
                <FormControl
                  className={classes.formControl}
                  style={{ marginBottom: 36 }}
                >
                  <Input
                    id="password-input"
                    type="password"
                    placeholder="Password"
                    className={classes.input}
                    disableUnderline={true}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <FormHelperText className={classes.helperText} error>
                    {error}
                  </FormHelperText>
                </FormControl>
              )}

              <Button
                variant="contained"
                color="secondary"
                disableElevation
                className={classes.submitButton}
                type={'submit'}
              >
                {showForgotPassword ? 'Submit' : 'Login'}
              </Button>

              <Button onClick={toggleForgotPassword} variant={'text'}>
                {showForgotPassword ? 'Back to Login' : 'Forgot Password?'}
              </Button>
            </Box>
          )}
        </LoadingBox>
      </form>
    </div>
  );
};

export default Login;
