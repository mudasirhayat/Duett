import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import WarningIcon from '@material-ui/icons/Warning';
import FlexBox from '../layout/FlexBox';
import useStore from '../../store';

const DuplicateEmailModalInsert = ({ create, update, patients }) => {
  const theme = useTheme();
  const closeModal = useStore((state) => state.closeModal);
  const [patientId, setPatientId] = useState(null);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Patient email already exists.
      </Typography>
      <FlexBox alignItems="center" my={2} mx={2}>
        <WarningIcon color="error" style={{ marginRight: theme.spacing(2) }} />
        <Typography variant="body2" color="error">
          The email address entered for this patient record is already tied to
          an existing patient.
        </Typography>
      </FlexBox>
      <Typography variant="body2" gutterBottom>
        If you want to update a patient's information, select a patient and
        choose "Update existing". If you intented to create a separate patient
        record choose "Create new".
      </Typography>
      <Box>
        <FormControl>
          <RadioGroup
            aria-label="patient"
            name="patient"
            value={patientId}
            onChange={(event) => setPatientId(parseInt(event.target.value))}
          >
            {patients.map((patient) => {
              return (
                <FormControlLabel
                  key={`PatientIdRadio_${patient.id}`}
                  value={patient.id}
                  control={<Radio />}
                  label={`${patient.first_name} ${patient.last_name}`}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </Box>
      <FlexBox justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          disableElevation={true}
          onClick={() => {
            closeModal();
            update(patientId);
          }}
          style={{ marginRight: theme.spacing(2) }}
        >
          Update existing
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation={true}
          onClick={() => {
            closeModal();
            create();
          }}
        >
          Create new
        </Button>
      </FlexBox>
    </>
  );
};

DuplicateEmailModalInsert.propTypes = {
  update: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  patients: PropTypes.array.isRequired,
};

export default DuplicateEmailModalInsert;
