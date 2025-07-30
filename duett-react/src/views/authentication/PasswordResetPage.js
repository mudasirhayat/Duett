import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Input,
  FormHelperText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useRoute } from 'wouter';
import logo from '../../assets/duett-logo.svg';
import ax from '../../lib/api';
import FlexBox from '../../components/layout/FlexBox';

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
  successMessage: {
    marginBottom: 36,
    color: 'white',
  },
  input: {
    marginRight: 0,
  },
  error: {
    marginLeft: 0,
    marginRight: 0,
  },
}));

const PasswordResetPage = () => {
  const classes = useStyles();

  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState({
    password1: '',
    password2: '',
  });
  const [, params] = useRoute('/reset/:uid/:token/');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res = await ax.post('/auth/password/reset/confirm/', {
        uid: params.uid,
        token: params.token,
        new_password1: password1,
        new_password2: password2,
      });
      if (res.status === 200) {
        setSuccess(true);
      } else {
        setError(
          'There was an error resetting your password. Please try again.'
        );
      }
    } catch (e) {
      const errorResponse = e.response?.data;
      let commonError = errorResponse.new_password1 ? '' : 'There was an error resetting your password. Please try again.';

      if(errorResponse.token) {
        commonError = 'Your reset link has expired or is invalid.'
      }

      setError({
        password1:errorResponse.new_password1,
        password2:errorResponse.new_password2 || commonError,
      });
    }
  }

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <img src={logo} alt="Duett Logo" className={classes.logo} />

        {success ? (
          <FlexBox column alignItems="center">
            <Typography className={classes.successMessage}>
              Your password has been reset.
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              disableElevation
              className={classes.submitButton}
              href="/login"
            >
              Sign In
            </Button>
          </FlexBox>
        ) : (
          <Box display="flex" flexDirection="column">
            <FormControl className={classes.formControl}>
              <Input
                id="password1"
                placeholder="Password"
                type="password"
                className={classes.input}
                disableUnderline={true}
                value={password1}
                onChange={(event) => setPassword1(event.target.value)}
              />
              <FormHelperText error={true} classes={{root: classes.error}}>{error.password1}</FormHelperText>
            </FormControl>

            <FormControl>
              <Input
                id="password1"
                placeholder="Password Confirmation"
                type="password"
                className={classes.input}
                disableUnderline={true}
                value={password2}
                onChange={(event) => setPassword2(event.target.value)}
              />
              <FormHelperText error={true}  classes={{root: classes.error}}>{error.password2}</FormHelperText>
            </FormControl>

            <Button
              variant="contained"
              color="secondary"
              disableElevation
              className={classes.submitButton}
              type={'submit'}
            >
              Submit
            </Button>
          </Box>
        )}
      </form>
    </div>
  );
};

export default PasswordResetPage;
