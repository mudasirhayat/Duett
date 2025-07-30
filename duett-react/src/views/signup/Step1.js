import React, { useState } from 'react';
import {
  Button,
  FormControl,
  Input,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
  errorText: {
    color: theme.palette.error.main,
    fontSize: 12,
    textAlign: 'left',
    width: '100%',
    marginTop: theme.spacing(0.5),
    marginLeft: 0,
  },
  container: {
    backgroundColor: 'white',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    textAlign: 'center',
    maxWidth: 400,
    width: '100%',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
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
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
  stepIndicator: {
    marginTop: theme.spacing(2),
    fontSize: 12,
    color: theme.palette.text.secondary,
  },
}));

const Step1 = ({ handleNextStep, authToken }) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^001\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Phone number must be 13 digits and start with '001'";
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneValidationError = validatePhoneNumber(phone);
    setPhoneError(phoneValidationError);

    if (phoneValidationError) {
      return;
    }

    if (isSubmitted) {
      handleNextStep();
      return;
    }

    try {
      const profileResponse = await api.post(
        '/api/users/custom-provider-profile/',
        {
          first_name: firstName,
          last_name: lastName,
          phone,
          account: company,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (profileResponse.status === 200 || profileResponse.status === 201) {
        setIsSubmitted(true);
        handleNextStep();
      } else {
        console.error('Failed to submit profile:', profileResponse);
      }
    } catch (error) {
      console.error('Error during profile submission:', error);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h5">Set up your profile</Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <FormControl className={classes.formControl}>
            <Input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disableUnderline
              className={classes.inputField}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <Input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disableUnderline
              className={classes.inputField}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <Input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              disableUnderline
              className={classes.inputField}
            />
          </FormControl>
          <FormControl
            className={classes.formControl}
            error={Boolean(phoneError)}
          >
            <Input
              type="text"
              placeholder="Phone - 001 XXX XXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              disableUnderline
              className={classes.inputField}
            />
            {phoneError && (
              <FormHelperText className={classes.errorText}>
                {phoneError}
              </FormHelperText>
            )}
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            className={classes.submitButton}
          >
            Next
          </Button>
          <Typography className={classes.stepIndicator}>Step 1 of 5</Typography>
        </form>
      </div>
    </div>
  );
};

export default Step1;
