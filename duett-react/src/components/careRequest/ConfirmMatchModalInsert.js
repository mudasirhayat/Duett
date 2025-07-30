import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Typography,
  makeStyles,
  useTheme,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from '../layout/FlexBox';
import useStore from '../../store';

const useStyles = makeStyles((theme) => ({
  loading: {
    position: 'absolute',
  },
}));

const ConfirmMatchModalInsert = ({ services, confirm }) => {
  const theme = useTheme();
  const classes = useStyles();
  const closeModal = useStore((state) => state.closeModal);
  const [undoloading, setUndoLoading] = useState(false);

  const handleConfirm = () => {
    setUndoLoading(true);
    return confirm();
  };

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Are you sure you want to match service(s) for provider?
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
        The selected service provider will receive an email notifying them they
        were selected. Other providers will be notified they were not matched.
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
          onClick={handleConfirm}
          disabled={undoloading}
        >
          Confirm
          {undoloading && (
            <CircularProgress size={20} className={classes.loading} />
          )}
        </Button>
      </FlexBox>
    </>
  );
};

ConfirmMatchModalInsert.propTypes = {
  confirm: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,
};

export default ConfirmMatchModalInsert;
