import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  makeStyles,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import SyncAltIcon from '@material-ui/icons/SyncAlt';

import FlexBox from '../layout/FlexBox';
import useStore from '../../store';
import DuettTextField from '../forms/DuettTextField';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import useCareRequestStore from '../../store/careRequests';
import Box from '@material-ui/core/Box';

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

const archiveOptions = [
  {
    title: 'Client deceased',
    value: 1,
  },
  {
    title: 'Client circumstances changed',
    value: 2,
  },
  {
    title: 'Client has moved to new agency',
    value: 3,
  },
  {
    title: 'Request fulfilled outside of Duett',
    value: 4,
  },
  {
    title: 'Other (tell us why)',
    value: 5,
  },
];

const deleteOptions = [
  {
    title: 'Client information entered incorrectly',
    value: 6,
  },
  {
    title: 'Care plan/request entered incorrectly',
    value: 7,
  },
];

const ConfirmDialog = ({
  title,
  confirm,
  description,
  confirmText,
  showQuestion = false,
  deleteRequest = false,
  questionText = 'Please tell us why?',
  reasons,
  service,
  isUndo,
  requestId,
  provider,
  triggerCancel,
}) => {
  const theme = useTheme();
  const [selectedReason, setSelectedReason] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const classes = useStyles();
  const closeModal = useStore((state) => state.closeModal);
  const [reason, setReason] = useState('');
  const [providers, setProviders] = useState([]);
  const [showUndoConfirmation, setShowUndoConfirmation] = useState(false);
  const [getProviderList, undoLoading] = useCareRequestStore((state) => [
    state.getProviderList,
    state.undoLoading,
  ]);
  const handleSelectChange = async (e) => {
    setSelectedReason(e.target.value);
    if (isUndo && e.target.value === 'reassign') {
      const { data } = await getProviderList(requestId, service.id);
      if (data.data.length) {
        setProviders(data.data);
      } else {
        setShowUndoConfirmation(false);
        setSelectedReason(null);
        alert('There are no other providers for this request');
      }
    }
  };

  const isReAssign = isUndo && selectedReason === 'reassign';

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const getOptions = () => {
    if (reasons) return reasons;
    return deleteRequest ? deleteOptions : archiveOptions;
  };

  const handleSelectProvider = (e) => {
    setSelectedProvider(e.target.value);
  };

  const isReassign = isUndo && selectedReason === 'reassign';
  const disabledReassign = isReassign && !selectedProvider;
  const disableMessage = !selectedReason || (selectedReason === 5 && !reason);
  const disabled = disableMessage || undoLoading || disabledReassign;

  const handleConfirm = () => {
    if (isReassign && !showUndoConfirmation) {
      return setShowUndoConfirmation(true);
    }
    const newReason =
      isReAssign && showUndoConfirmation
        ? `${selectedReason}_confirm`
        : selectedReason;
    return confirm(newReason, reason, service, selectedProvider);
  };

  const handleCloseModal = () => {
    if (isUndo) {
      triggerCancel();
    }
    closeModal();
  };

  const handleCancel = () => {
    if (isUndo) {
      triggerCancel();
    }
    if (isReAssign && showUndoConfirmation) {
      return setShowUndoConfirmation(false);
    }
    closeModal();
  };

  const getTitle = () => {
    if (showUndoConfirmation)
      return 'Are you sure you want to match service(s) for provider?';
    return title;
  };

  const getDescription = () => {
    if (showUndoConfirmation)
      return 'The selected service provider will receive an email notifying them they were selected. Other providers will be notified that they were not matched.';
    return description;
  };

  const getConfirmText = () => {
    if (showUndoConfirmation) return 'Confirm';
    if (isReAssign) return 'Reassign';
    return confirmText;
  };

  const getProviderName = () => {
    return providers.find((provider) => provider.id === selectedProvider)?.name;
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
      <Typography
        variant="h2"
        gutterBottom
        className={clsx(classes.title, {
          [classes.marginLess]: showUndoConfirmation,
        })}
      >
        {getTitle()}
      </Typography>
      {showUndoConfirmation && (
        <FlexBox
          className={classes.wrapperReassign}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body2">{provider.account.name}</Typography>
          <SyncAltIcon color="primary" />
          <Typography variant="body2">{getProviderName()}</Typography>
        </FlexBox>
      )}
      <Typography variant="body2" gutterBottom>
        {getDescription()}
      </Typography>
      {showQuestion && !showUndoConfirmation && (
        <Typography variant="body2" gutterBottom>
          {questionText}
        </Typography>
      )}
      {!showUndoConfirmation && (
        <>
          <Select
            disableUnderline
            displayEmpty
            className={classes.select}
            style={{ marginBottom: selectedReason === 'other' ? 10 : 30 }}
            onChange={handleSelectChange}
            value={selectedReason}
          >
            <MenuItem value={null} disabled selected>
              Select...
            </MenuItem>
            {getOptions().map((option, key) => (
              <MenuItem key={option.value} value={option.value}>
                {option.title}
              </MenuItem>
            ))}
          </Select>

          {isReAssign && (
            <Select
              disableUnderline
              displayEmpty
              className={classes.select}
              style={{ marginBottom: selectedReason === 'other' ? 10 : 30 }}
              onChange={handleSelectProvider}
              value={selectedProvider}
            >
              <MenuItem value={null} disabled selected>
                Select...
              </MenuItem>
              {providers.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          )}
        </>
      )}
      {selectedReason === 5 && (
        <div className={classes.textAreaWrapper}>
          <DuettTextField
            multiline={true}
            InputProps={{
              className: classes.textarea,
              disableUnderline: true,
              placeholder: 'Please tell us why',
            }}
            inputProps={{
              maxLength: 500,
            }}
            rows={6}
            onChange={handleReasonChange}
            value={reason}
          />
          <span className={classes.textAreaPlaceholder}>
            {reason.length}/500
          </span>
        </div>
      )}
      <FlexBox justifyContent="center">
        <Button
          variant="text"
          color="primary"
          disableElevation={true}
          onClick={handleCancel}
          disabled={undoLoading}
          style={{ marginRight: theme.spacing(2) }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disableElevation={true}
          onClick={handleConfirm}
          disabled={disabled}
        >
          {getConfirmText()}
          {undoLoading && (
            <CircularProgress size={20} className={classes.loading} />
          )}
        </Button>
      </FlexBox>
    </>
  );
};

export default ConfirmDialog;
