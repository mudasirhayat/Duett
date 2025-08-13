import React, { useState } from 'react';
import {
  makeStyles,
  Typography,
  Modal,
  Button,
  Box,
  MobileStepper,
} from '@material-ui/core';
import theme from '../../../theme';
import qrwizardSteps from './qrWizardSteps';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '90%',
    maxWidth: 500,
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
  stepper: {
    maxWidth: 400,
    flexGrow: 1,
    margin: '0 auto',
    backgroundColor: 'transparent',
  },
  heading: {
    fontSize: '16px',
    textAlign: 'center',
  },
}));

const QR2FAWizardMobile = ({ open, setWizard }) => {
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
        <MobileStepper
          variant="dots"
          steps={qrwizardSteps.length}
          position="static"
          activeStep={activeStep}
          className={classes.stepper}
        />
        {renderStepContent()}
        <Box
          display="flex"
          justifyContent="center"
          align="center"
          sx={{ mt: 4 }}
        >
          {activeStep > 0 && (
            <Button
              variant="contained"
              color="secondary"
              disableElevation
              style={{ marginBottom: theme.spacing(2), marginRight: '20px' }}
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color={
activeStep === qrwizardSteps.length - 1 ? 'primary' : 'primary',
            disableElevation: true,
            style: { marginBottom: theme.spacing(2) }
            onClick={handleNext}
          >
            {activeStep === qrwizardSteps.length - 1 ? 'Got it' : 'Next'}
          </Button>
        </Box>
      </div>
    </Modal>
  );
};

export default QR2FAWizardMobile;
