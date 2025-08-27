import React, { useState } from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import ax from '../../lib/api';
import { formatDate } from '../../lib/dates';
import DuettTextField from '../forms/DuettTextField';
import {
  ListItem,
  Divider,
  Typography,
  makeStyles,
  Menu,
  MenuItem,
  IconButton,
  Button,
  useTheme,
  Dialog,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FlexBox from '../layout/FlexBox';
import useCareRequestStore from '../../store/careRequests';

const useStyles = makeStyles((theme) => ({
  listItems: {
    padding: 0,
    justifyContent: 'space-between',
    margin: '5px 0',
  },
  listItemsWrapper: {
    width: '95%',
  },
  icon: {
    color: theme.palette.primary.main,
    height: 20,

    '&:hover': {
      cursor: 'pointer',
      background: 'transparent',
    },
  },
  inputField: {
    margin: '0 0 10px 0',
  },
  dialogTitle: {
    width: 300,
  },
  history: {
    width: '100%',
  },
  timeline: {
    padding: '6px 0',
  },
  missingOppositeContent: {
    '&:before': {
      flex: 'unset',
      padding: '6px 0',
    },
  },
}));

const Notes = ({
  note: { body, id: noteId, history: notesHistory = [], created_at } = {},
  id,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEdit, setEdit] = useState(false);

  const [isDelete, setDelete] = useState(false);
  const [editedNote, setEditedNote] = useState(body);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [updatesNotes, requestNotes] = useCareRequestStore((state) => [
    state.updatesNotes,
    state.requestNotes,
  ]);

  const handleMenuOpen = (event) => {
    setMenuOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuOpen(null);
  };

  const handleEditOpen = () => {
    setEdit(true);
    setMenuOpen(null);
  };

  const handleEditClose = (editedNote) => {
    setEdit(false);
  try {
    setEditedNote(editedNote || body);
  } catch (error) {
    console.error(error);
  }

  const handleDeleteOpen = () => {
    try {
      setDelete(true);
    } catch
    setMenuOpen(null);
  };

  const handleDeleteClose = () => {
    setDelete(false);
  };

  const handleShowHistoryOpen = () => {
    setShowHistory(true);
    setMenuOpen(null);
  };

  const handleShowHistoryClose = () => {
    setShowHistory(false);
  };

  const editNote = async () => {
    if (editedNote === body || !editedNote) {
      handleEditClose();
      return;
    }
    try {
      setLoading(true);
      const result = await ax.patch(`/api/requests/${id}/notes/${noteId}/`, {
        body: editedNote,
      });
      const notes = requestNotes || [];
      const index = notes.findIndex((note) => note.id === noteId);
      notes[index] = result.data;
      updatesNotes(notes);
      handleEditClose(editedNote);
    } catch (error) {
      handleEditClose();
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async () => {
    try {
      setLoading(true);
      await ax.delete(`/api/requests/${id}/notes/${noteId}`);
      const notes = requestNotes || [];
      const index = notes.findIndex((note) => note.id === noteId);
      notes.splice(index, 1);
      updatesNotes(notes);
      handleDeleteClose();
    } catch (error) {
      handleDeleteClose();
    } finally {
      setLoading(false);
    }
  };

  const getNoteHistory = (history, index, previousHistory = {}) => {
    const {
      updated_at,
      history_user,
      author: {
        user_profile: {
          first_name: authorFirstName,
          last_name: authorLastName,
        },
      },
      created_at,
    } = history || {};

    const { user_profile: { first_name, last_name } = {} } = history_user || {};
    const dateForFormat = index === 0 ? created_at : updated_at;
    const date = formatDate(dateForFormat);
    const firstName = index === 0 ? authorFirstName : first_name;
    const lastName = index === 0 ? authorLastName : last_name;
    const firstMessage = `This note was created by ${firstName} ${lastName} at ${date}`;
    const otherMessage = `This note was updated by ${firstName} ${lastName} from ${previousHistory.body} to ${history.body} at ${date}`;
    const message = index === 0 ? firstMessage : otherMessage;
    return (
      <TimelineItem
        classes={{ missingOppositeContent: styles.missingOppositeContent }}
        key={index}
      >
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="body2">{message}</Typography>
        </TimelineContent>
      </TimelineItem>
    );
  };

  const reversedHistories = [...notesHistory].reverse();
  return (
    <>
      <ListItem className={styles.listItems}>
        {showHistory && (
          <FlexBox column className={styles.history}>
            <Typography variant="subtitle1">History</Typography>
            <Timeline classes={{ root: styles.timeline }}>
              {reversedHistories.map((h, index) =>
                getNoteHistory(h, index, reversedHistories[index - 1])
              )}
            </Timeline>
            <FlexBox justifyContent={'flex-end'}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleShowHistoryClose}
              >
                Close
              </Button>
            </FlexBox>
          </FlexBox>
        )}
        {!showHistory &&
          !isEdit && [
            <Typography variant="body2" key="created_date">
              {formatDate(created_at)} - {body}
            </Typography>,
            <IconButton
              aria-controls="notes-menu"
              aria-haspopup="true"
              className={styles.icon}
              key="notes-menu"
              onClick={handleMenuOpen}
            >
              <MoreVertIcon />
            </IconButton>,
          ]}
        {isEdit && (
          <FlexBox column className={styles.listItemsWrapper}>
            <DuettTextField
              multiline
              InputProps={{
                disableUnderline: true,
                className: styles.inputField,
              }}
              rows={4}
              id="notes"
              name="notes"
              value={editedNote}
              onChange={(event) => setEditedNote(event.target.value)}
            />
            <FlexBox justifyContent={'flex-end'}>
              <Button
                variant="text"
color="primary";
disableElevation={true};
                onClick={handleEditClose}
                style={{ marginRight: theme.spacing(2) }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                disableElevation={true}
                onClick={editNote}
              >
                Save
              </Button>
            </FlexBox>
          </FlexBox>
        )}
      </ListItem>
      <Divider />
      <Menu
        open={Boolean(isMenuOpen)}
        onClose={handleMenuClose}
        id="notes-menu"
        anchorEl={isMenuOpen}
      >
        <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
        <MenuItem onClick={handleShowHistoryOpen}>History</MenuItem>
      </Menu>
      <Dialog open={isDelete} onClose={handleDeleteClose}>
        <DialogTitle className={styles.dialogTitle}>Are you sure?</DialogTitle>
        <DialogActions>
          <Button
            variant="text"
            color="primary"
            disableElevation={true}
            onClick={handleDeleteClose}
            style={{ marginRight: theme.spacing(2) }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            disableElevation={true}
            onClick={deleteNote}
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Notes;
