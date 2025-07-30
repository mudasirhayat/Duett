import React from 'react';
import { Button, makeStyles, Typography, useTheme } from '@material-ui/core';

import FlexBox from '../layout/FlexBox';
import useStore from '../../store';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import useCareRequestStore from '../../store/careRequests';

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
  textAreaWrapper: {
    position: 'relative',
  },
  textAreaPlaceholder: {
    position: 'absolute',
    right: 10,
    bottom: 40,
    fontSize: 14,
    lineHeight: '16px',
    color: '#959595',
  },
  loading: {
    position: 'absolute',
  },
  marginLess: {
    marginBottom: 10,
    textAlign: 'left',
  },
  wrapperReassign: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    padding: '10px 12px',
    marginBottom: 12,
    borderRadius: 5,
  },
}));

const UserConfirmationDialog = ({
  title,
  confirm,
  description,
  confirmText,
}) => {
  const theme = useTheme();
  const classes = useStyles();
  const closeModal = useStore((state) => state.closeModal);

  const handleConfirm = () => {
    return confirm();
  };

  const handleCloseModal = () => {
    closeModal();
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
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" gutterBottom>
        {description}
      </Typography>
      <FlexBox justifyContent="center">
        <Button
          variant="text"
          color="primary"
          disableElevation={true}
          onClick={handleCloseModal}
          style={{ marginRight: theme.spacing(2) }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation={true}
          onClick={handleConfirm}
        >
          {confirmText}
        </Button>
      </FlexBox>
    </>
  );
};

export default UserConfirmationDialog;
