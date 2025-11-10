import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Typography,
  IconButton,
  CircularProgress,
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
  fileInput: {
    marginTop: theme.spacing(2),
    marginRight: 0,
  },
  documentList: {
    marginTop: theme.spacing(2),
    textAlign: 'left',
    height: '100px', // Fixed height for the container
    overflowY: 'auto', // Enable vertical scrolling when overflowing
  },
  documentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
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
  doneButton: {
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
  loaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(4),
  },
}));

const Step5 = ({ handleNextStep, handlePreviousStep }) => {
  const classes = useStyles();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setDocuments: storeDocuments, authToken } = useSignupStore();

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    const validFiles = files.filter((file) => allowedTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert('Only PDF, JPG, and PNG files are allowed.');
    }

    setDocuments((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveDocument = (document) => {
try {
    setDocuments((prev) => prev.filter((doc) => doc !== document));
  } catch (error) {
    console.error(error);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (documents.length === 0) {
      console.error('No documents to upload.');
      return;
    }

    setLoading(true);

    const formData = new FormData();

    // Append each document to the FormData
    documents.forEach((document) => {
      formData.append('files', document, document.name);
    });

    try {
      // Send the form data to the backend using Axios
      const response = await api.post('/api/users/upload-docs/', formData, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Do not set Content-Type
        },
      });

      if (response.status === 201) {
        storeDocuments(documents); // Store the documents in Zustand
        handleNextStep(); // Move to the next step
      } else {
        console.error('Failed to upload documents:', response.data);
      }
    } catch (error) {
      console.error('Error submitting documents:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <Typography variant="h5">Upload Documentation</Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ marginTop: 16 }}
        >
          Please upload your documentation from Indiana FSSA/OMPP. Examples
          include Medicaid Waiver Service Provider Certification or
          Certification of Provider Enrollment for Medicaid Home and
          Community-Based Services.
        </Typography>

        <form onSubmit={handleSubmit} className={classes.form}>
          <Input
            type="file"
            onChange={handleUpload}
            className={classes.fileInput}
            inputProps={{ multiple: true, accept: '.pdf, .jpg, .jpeg, .png' }}
          />

          <Box className={classes.documentList}>
            {documents.map((document, index) => (
              <Box key={index} className={classes.documentItem}>
                <Typography>{document.name}</Typography>
                <IconButton
                  onClick={() => handleRemoveDocument(document)}
                  size="small"
                >
                  <Close />
                </IconButton>
              </Box>
            ))}
          </Box>

          {loading ? (
            <Box className={classes.loaderContainer}>
              <CircularProgress />
            </Box>
          ) : (
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
                className={classes.doneButton}
                disabled={documents.length === 0}
              >
                Done
              </Button>
            </div>
          )}

          <Typography className={classes.stepIndicator}>Step 5 of 5</Typography>
        </form>
      </div>
    </div>
  );
};

export default Step5;
