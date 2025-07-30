import React, { useEffect, useState } from 'react';
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
import { Autocomplete } from '@material-ui/lab';
import FlexBox from '../layout/FlexBox';
import useStore from '../../store';
import DuettTextField from '../forms/DuettTextField';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import useCareRequestStore from '../../store/careRequests';
import Box from '@material-ui/core/Box';
import ax from '../../lib/api';
import AutocompleteInstantSelect from './SelectSearch';

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
  loading: {
    marginBottom: 10,
  },
  circularLoader: {
    position: 'absolute',
  },
}));

const ChangeAssigneeModal = ({ id, confirm }) => {
  const theme = useTheme();
  const classes = useStyles();
  const closeModal = useStore((state) => state.closeModal);
  const [selectedCM, setSelectedCM] = useState(null);
  const [loader, setloader] = useState(false);
  const [users, setUsers] = useState([]);
  const [undoloading, setUndoLoading] = useState(false);
  const [getProviderList, undoLoading] = useCareRequestStore((state) => [
    state.getProviderList,
    state.undoLoading,
  ]);

  const handleCancel = () => {
    closeModal();
  };
  const handleCloseModal = () => {
    closeModal();
  };

  const handleConfirm = () => {
    setUndoLoading(true);
    return confirm(selectedCM);
  };

  const handleSelectChange = async (e) => {
    setSelectedCM(e.target.value);
  };

  const getTitle = () => {
    return 'Assign this Care Request to another Care Manager';
  };

  const getDescription = () => {
    return 'Select a Care Manager and click "Assign"';
  };

  const loadOptions = async () => {
    try {
      setloader(true);
      let res = await ax.get(`/api/patients/request/${id}/`);
      if (res.status === 200) {
        setUsers(res.data.data);
        setloader(false);
      }
    } catch (e) {
      setloader(false);
      alert('There was an error loading care manager.');
    }
    return true;
  };

  useEffect(() => {
    loadOptions();
  }, []);

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
      {!loader ? (
        <AutocompleteInstantSelect
          options={users}
          getOptionLabel={(option) => option?.agency_name || ''}
          onChange={(selectedOption) => setSelectedCM(selectedOption?.user_id)}
        />
      ) : (
        <>
          <FlexBox justifyContent="center">
            <CircularProgress size={20} className={classes.loading} />
          </FlexBox>
        </>
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
          disabled={!selectedCM || undoloading}
          id="confirm-button"
        >
          Assign
          {undoloading && (
            <CircularProgress size={20} className={classes.circularLoader} />
          )}
        </Button>
      </FlexBox>
    </>
  );
};

export default ChangeAssigneeModal;
