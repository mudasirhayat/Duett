import React, { useState } from 'react';
import {
  Button,
  FormControl,
  Input,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  FormHelperText,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import logo from '../../assets/duett-logo-updated.svg';
import api from '../../lib/api';

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
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
  inputField: {
    width: '100%',
    marginRight: '0px',
  },
  submitButton: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    marginTop: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  errorText: {
    color: theme.palette.error.main,
    fontSize: 12,
    textAlign: 'left',
    width: '100%',
    marginTop: theme.spacing(0.5),
    marginLeft: 0,
  },
  circularProgress: {
    marginTop: theme.spacing(2),
  },
  checkboxLabel: {
    marginBottom: theme.spacing(2),
    fontSize: '0.875rem',
  },
  disclaimerText: {
    fontSize: '0.75rem',
    marginTop: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
  },
}));

const Step0 = ({ handleNextStep, setAuthToken, setRefreshToken }) => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailExistsError, setEmailExistsError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    const newErrors = {};
    newErrors.email = email
      ? emailRegex.test(email)
        ? ''
        : 'Enter a valid email'
      : 'Email is required';
    newErrors.password = password ? '' : 'Password is required';
    newErrors.confirmPassword = confirmPassword
      ? ''
      : 'Confirm Password is required';
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return (
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword &&
      agree
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const userResponse = await api.post('/api/users/', {
          email,
          password,
          account: 'DummyAccount',
          user_profile: {
            first_name: 'DummyFirst',
            last_name: 'DummyLast',
            phone: '0011234567890',
          },
          group: 'Care Provider Admin',
        });

        if (userResponse.status === 201 || userResponse.status === 200) {
          const tokenResponse = await api.post('/api/token/', {
            email,
            password,
          });
          if (tokenResponse.status === 200) {
            const { access, refresh } = tokenResponse.data;
            setAuthToken(access);
            setRefreshToken(refresh);
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // Store credentials in localStorage to use them later for login
            localStorage.setItem('signup_email', email);
            localStorage.setItem('signup_password', password);

            handleNextStep();
          }
        } else {
          console.error('Failed to create user:', userResponse);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.status === 400 &&
          error.response.data.email
        ) {
          setEmailExistsError('This email is already in use.');
        } else {
          console.error('Error during signup:', error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: 'Failed to create account. Please try again.',
          }));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <img src={logo} alt="Duett Logo" />
        <Typography variant="h5">Create your account</Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          {/* Form Inputs */}
          <FormControl
            className={classes.formControl}
            error={Boolean(errors.email) || Boolean(emailExistsError)}
          >
            <Input
              id="email-input"
              placeholder="Email"
              disableUnderline
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={classes.inputField}
            />
            {(errors.email || emailExistsError) && (
              <FormHelperText className={classes.errorText}>
                {errors.email || emailExistsError}
              </FormHelperText>
            )}
          </FormControl>

          {/* Password Fields */}
          <FormControl
            className={classes.formControl}
            error={Boolean(errors.password)}
          >
            <Input
              id="password-input"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              disableUnderline
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              className={classes.inputField}
            />
            {errors.password && (
              <FormHelperText className={classes.errorText}>
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>

          {/* Confirm Password */}
          <FormControl
            className={classes.formControl}
            error={Boolean(errors.confirmPassword)}
          >
            <Input
              id="confirm-password-input"
              placeholder="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              disableUnderline
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              className={classes.inputField}
            />
            {errors.confirmPassword && (
              <FormHelperText className={classes.errorText}>
                {errors.confirmPassword}
              </FormHelperText>
            )}
          </FormControl>

          {/* Agreement Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                color="primary"
              />
            }
            label="By checking this box, you agree to the BAA."
            className={classes.checkboxLabel}
          />

          {/* Submit Button */}
          {loading ? (
            <CircularProgress className={classes.circularProgress} />
          ) : (
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButton}
              disabled={!agree}
            >
              Create My Account
            </Button>
          )}

          <Typography className={classes.disclaimerText}>
            By clicking "Create My Account", you agree to the Terms and
            Conditions and confirm that you are authorized to enter into
            agreements on behalf of your organization.
          </Typography>
        </form>
      </div>
    </div>
  );
};

export default Step0;
