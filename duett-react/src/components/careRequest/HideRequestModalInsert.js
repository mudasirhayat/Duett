import React from 'react';
import { Button, makeStyles, Typography, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from '../layout/FlexBox';
import useStore from '../../store';

const HideRequestModalInsert = ({ confirm }) => {
  const theme = useTheme();
  const closeModal = useStore((state) => state.closeModal);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Are you sure you want to hide request from view?
      </Typography>
      <Typography variant="body2" gutterBottom>
        The selected Care Request will be hidden from your Dashboard. You will
        be able to see this again by clicking the "Show Hidden" toggle on your
        dashboard.
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

HideRequestModalInsert.propTypes = {
  confirm: PropTypes.func,
};

export default HideRequestModalInsert;
