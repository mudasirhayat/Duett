import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons'; // Import the Close icon
import useSignupStore from '../../store/signup';
import api from '../../lib/api'; // Import axios instance

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
  inputField: {
    marginRight: 0,
  },
  select: {
    marginRight: 0,
  },
  serviceContainer: {
    marginTop: theme.spacing(2),
    textAlign: 'left',
    height: '100px', // Fixed height for the container
    overflowY: 'auto', // Enable vertical scrolling when overflowing
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

const Step3 = ({ handleNextStep, handlePreviousStep, authToken }) => {
  const classes = useStyles();
  const { setServices, services: storedServices } = useSignupStore();
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(storedServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/api/users/provider/service-type/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAvailableServices(response.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [authToken]);

  const handleAddService = (serviceId) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices((prev) => [...prev, serviceId]);
    }
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    try {
      await api.patch(
        '/api/users/provider/service-type/',
        { service_type_ids: selectedServices },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setServices(selectedServices);
      handleNextStep(); // Move to the next step
    } catch (error) {
      console.error('Error during service submission:', error);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h5">
          My organization can provide the following services:
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          <FormControl className={classes.inputField}>
            <Select
              value=""
              onChange={(e) => handleAddService(e.target.value)}
              displayEmpty
              className={classes.select}
            >
              <MenuItem value="" disabled>
                Select a service
              </MenuItem>
              {availableServices.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box className={classes.serviceContainer}>
            {selectedServices.map((serviceId) => {
              const service = availableServices.find((s) => s.id === serviceId);
              return (
                <Box
                  key={serviceId}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{service?.name}</Typography>
                  <IconButton
                    onClick={() => handleRemoveService(serviceId)}
                    size="small"
                  >
                    <Close />
                  </IconButton>
                </Box>
              );
            })}
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
              disabled={selectedServices.length === 0}
            >
              Next
            </Button>
          </div>
          <Typography className={classes.stepIndicator}>Step 3 of 5</Typography>
        </form>
      </div>
    </div>
  );
};

export default Step3;
