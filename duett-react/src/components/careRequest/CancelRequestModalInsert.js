import React from 'react';
import { Button, Typography, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from '../layout/FlexBox';
import useStore from '../../store';

const CancelRequestModalInsert = ({ confirm }) => {
  const theme = useTheme();
  const closeModal = useStore((state) => state.closeModal);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Are you sure you want to cancel your notification?
      </Typography>
      <Typography variant="body2" gutterBottom>
        The selected Care Manager will receive an email notifying them you are
        no longer interested in the care request.
      </Typography>
      <FlexBox justifyContent="center">
        <Button
          variant="text"
          color="primary"
          disableElevation={true}
          onClick={closeModal}
          style={{ marginRight: theme.spacing(2) }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation={true}
          onClick={confirm}
        >
          Confirm
        </Button>
      </FlexBox>
    </>
  );
};

CancelRequestModalInsert.propTypes = {
  confirm: PropTypes.func,
};

export default CancelRequestModalInsert;
