import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons'; // Import the Close icon
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
  select: {
    marginRight: 0,
  },
  countyContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'left',
    height: '100px',
    overflowY: 'auto', // Enable vertical scrolling
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

const Step4 = ({ handleNextStep, handlePreviousStep, authToken }) => {
  const classes = useStyles();
  const { counties: storedCounties, setCounties } = useSignupStore();
  const [availableCounties, setAvailableCounties] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState(storedCounties);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const response = await api.get('/api/funding-sources/county/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAvailableCounties(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch counties:', error);
        setLoading(false);
      }
    };

    fetchCounties();
  }, [authToken]);

  useEffect(() => {
    setSelectedCounties(storedCounties);
  }, [storedCounties]);

  const handleAddCounty = (county) => {
    if (!selectedCounties.some((c) => c.id === county.id)) {
      setSelectedCounties((prev) => [...prev, county]);
    }
  };

  const handleRemoveCounty = (county) => {
    setSelectedCounties((prev) => prev.filter((c) => c.id !== county.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        county_ids: selectedCounties.map((county) => county.id),
      };
      await api.patch('/api/funding-sources/county/', payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setCounties(selectedCounties);
      handleNextStep();
    } catch (error) {
      console.error('Failed to update counties:', error);
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
        <Typography variant="h5">Select Counties</Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <FormControl className={classes.inputField}>
            <Select
              value=""
              onChange={(e) => handleAddCounty(e.target.value)}
              displayEmpty
              className={classes.select}
            >
              <MenuItem value="" disabled>
                Select a county
              </MenuItem>
              {availableCounties.map((county) => (
                <MenuItem key={county.id} value={county}>
                  {county.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className={classes.countyContainer}>
            {selectedCounties.map((county) => (
              <Box
                key={county.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography>{county.name}</Typography>
                <IconButton
                  onClick={() => handleRemoveCounty(county)}
                  size="small"
                >
                  <Close />
                </IconButton>
              </Box>
            ))}
          </Box>

          <div className={classes.buttonsContainer}>
            <Button
              variant="contained"
              className={classes.previousButton}
              onClick={handlePreviousStep}
            >
              Previous
            </Button>
            <Button
              type="submit"
              variant="contained"
              className={classes.nextButton}
              disabled={selectedCounties.length === 0}
            >
              Next
            </Button>
          </div>
          <Typography className={classes.stepIndicator}>Step 4 of 5</Typography>
        </form>
      </div>
    </div>
  );
};

export default Step4;
