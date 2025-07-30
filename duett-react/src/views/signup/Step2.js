import React, { useState, useEffect } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useSignupStore from '../../store/signup';
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
    height: '500px', // Fixed height
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  fundingSourcesContainer: {
    maxHeight: 150,
    overflowY: 'auto',
    marginTop: theme.spacing(2),
    textAlign: 'left',
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(4),
  },
  previousButton: {
    backgroundColor: theme.palette.grey[300],
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
  },
  nextButton: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
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

const Step2 = ({ handleNextStep, handlePreviousStep, authToken }) => {
  const classes = useStyles();
  const { fundingSources, setFundingSources, setServices } = useSignupStore();
  const [availableFundingSources, setAvailableFundingSources] = useState([]);
  const [selectedFundingSources, setSelectedFundingSources] =
    useState(fundingSources);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFundingSources = async () => {
      try {
        const response = await api.get('/api/users/provider/funding-source/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAvailableFundingSources(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch funding sources:', error);
        setLoading(false);
      }
    };

    fetchFundingSources();
  }, [authToken]);

  useEffect(() => {
    setSelectedFundingSources(fundingSources);
  }, [fundingSources]);

  const handleCheckboxChange = (sourceId) => {
    const updatedSources = selectedFundingSources.includes(sourceId)
      ? selectedFundingSources.filter((id) => id !== sourceId)
      : [...selectedFundingSources, sourceId];

    // Reset services when funding sources change
    setSelectedFundingSources(updatedSources);
    setServices([]); // Clear services when funding sources change
  };

  const handleNext = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      const payload = { funding_source_ids: selectedFundingSources };
      await api.patch('/api/users/provider/funding-source/', payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setFundingSources(selectedFundingSources);
      handleNextStep();
    } catch (error) {
      console.error('Failed to update funding sources:', error);
    }
  };

  if (loading) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h5">
          My organization provides services under the following funding sources:
        </Typography>
        <form className={classes.form} onSubmit={handleNext}>
          <div className={classes.fundingSourcesContainer}>
            {availableFundingSources.map((source) => (
              <FormControlLabel
                key={source.id}
                control={
                  <Checkbox
                    checked={selectedFundingSources.includes(source.id)}
                    onChange={() => handleCheckboxChange(source.id)}
                    color="primary"
                  />
                }
                label={source.name}
              />
            ))}
          </div>
          <div className={classes.buttonsContainer}>
            {/* <Button variant="contained" className={classes.previousButton} onClick={handlePreviousStep}>
              Previous
            </Button> */}
            <Button
              type="submit"
              variant="contained"
              className={classes.nextButton}
              disabled={selectedFundingSources.length === 0}
            >
              Next
            </Button>
          </div>
          <Typography className={classes.stepIndicator}>Step 2 of 5</Typography>
        </form>
      </div>
    </div>
  );
};

export default Step2;
