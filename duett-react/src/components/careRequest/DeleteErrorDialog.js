import React from 'react';
import clsx from 'clsx';
import FlexBox from '../layout/FlexBox';
import useStore from '../../store';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Button, makeStyles, Typography, useTheme } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  title: {
    marginBottom: 50,
    textAlign: 'center',
  },
  select: {
    width: '100%',
  },
  textarea: {
    marginRight: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
}));

const DeleteErrorDialog = ({ status }) => {
  const theme = useTheme();
  const classes = useStyles();
  const closeModal = useStore((state) => state.closeModal);

  const handleCloseModal = () => {
    closeModal();
  };

  const getTitle = () => {
    return 'Care Request May Not Be Deleted';
  };

  const getDescription = () => {
    return `You may not delete this Care Request. It has already been ${status?.toLowerCase()}.`;
  };

  return (
    <>
      <IconButton
        onClick={handleCloseModal}
        aria-label="close"
        className={classes.closeButton}
      >
        <CloseIcon />
      </IconButton>
      <Typography variant="h2" gutterBottom className={clsx(classes.title)}>
        {getTitle()}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {getDescription()}
      </Typography>
      <FlexBox justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          disableElevation={true}
          onClick={handleCloseModal}
          style={{ marginRight: theme.spacing(2) }}
        >
          Cancel
        </Button>
      </FlexBox>
    </>
  );
};

export default DeleteErrorDialog;
