import React, { useState } from 'react';
import {
  makeStyles,
  Typography,
  Modal,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core';
import theme from '../../../theme';
import qrwizardSteps from './qrWizardSteps';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 750,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.blue.main}`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(6, 12),
    '&:focus': {
      outline: 'none',
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
    backgroundColor:
      'rgba(255, 255, 255, 0.5)' /* Adjust the alpha value for transparency */,
    backdropFilter: 'blur(5px)' /* Apply a blur effect */,
  },
  title: {
    marginBottom: 50,
    textAlign: 'center',
  },
  heading: {
    fontSize: '16px',
    textAlign: 'center',
  },
}));

const QR2FAWizardDesktop = ({ open, setWizard }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === qrwizardSteps.length - 1) {
      handleClose();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleClose = () => {
    localStorage.setItem('qrwizard', 'done');
    setWizard(false);
  };

  const renderStepContent = () => {
    const currentStep = qrwizardSteps[activeStep];

    return (
      <>
        <Typography className={classes.heading} color="primary" gutterBottom>
          {currentStep.title2}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {currentStep.description}
        </Typography>
      </>
    );
  };

  return (
    <Modal open={open} className={classes.modalWrapper}>
      <div className={classes.paper}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {qrwizardSteps.map((step) => (
            <Step key={step.title}>
              <StepLabel>{step.title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {renderStepContent()}
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mt: 4 }}
        >
          {activeStep > 0 && (
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              style={{
                marginBottom: theme.spacing(2),
                marginLeft: theme.spacing(2),
                borderRadius: 0,
              }}
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color={
              activeStep === qrwizardSteps.length - 1 ? 'primary' : 'primary'
            }
            disableElevation
            style={{
              marginBottom: theme.spacing(2),
              borderRadius: 0,
            }}
            onClick={handleNext}
          >
            {activeStep === qrwizardSteps.length - 1 ? 'Got it' : 'Next'}
          </Button>
        </Box>
      </div>
    </Modal>
  );
};

export default QR2FAWizardDesktop;
