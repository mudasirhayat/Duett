import React from 'react';
import { Button, Typography, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from '../layout/FlexBox';
import useStore from '../../store';

const NotifyRequestModalInsert = ({ services, confirm }) => {
  const theme = useTheme();
  const closeModal = useStore((state) => state.closeModal);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Are you sure you want to be notified for this care request?
      </Typography>
      {services.map((service) => {
        return (
          <Typography
            key={`Service_${service.id}`}
            variant="body2"
            gutterBottom
          >
            {service.service}
          </Typography>
        );
      })}
      <Typography variant="body2" gutterBottom>
        The selected Care Manager will receive an email notifying them you are
        interested in the request.
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

NotifyRequestModalInsert.propTypes = {
  confirm: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,
};

export default NotifyRequestModalInsert;
