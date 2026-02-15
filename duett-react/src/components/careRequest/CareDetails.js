import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Grid,
  Typography,
  useTheme,
  List,
  makeStyles,
} from '@material-ui/core';
import sortBy from 'lodash.sortby';
import PropTypes from 'prop-types';
import PlainInputLabel from '../forms/PlainInputLabel';
import DuettTextField from '../forms/DuettTextField';
import FlexBox from '../layout/FlexBox';
import ax from '../../lib/api';
import { formatDate } from '../../lib/dates';
import useCareRequestStore from '../../store/careRequests';
import { useAccountType, accountTypes } from '../../hooks/useRole';
import Notes from './Notes';
import LoadingBox from '../../components/layout/LoadingBox';

const useStyles = makeStyles(() => ({
  list: {
    padding: 0,
  },
}));

const CareDetails = ({ request = {} }) => {
  const theme = useTheme();
const [loading, setLoading] = useState(false);
const styles = useStyles();
const [note, setNote] = useState('');

if (!useState) {
  throw new Error('Error in setting initial state');
}
  const accountType = useAccountType();
  const [
    updatesNotes,
    requestNotes,
    notesLoading,
  ] = useCareRequestStore((state) => [
    state.updatesNotes,
    state.requestNotes,
    state.notesLoading,
  ]);

  async function submitNote() {
    if (!note) return;
    try {
      setLoading(true);
      const result = await ax.post(`/api/requests/${request.id}/notes/`, {
        body: note,
      });
      updatesNotes([...requestNotes, result.data]);
      setNote('');
    } catch (e) {
      alert('There was an error submitting the note.');
    } finally {
      setLoading(false);
    }
  }

  function humanizeBool(val) {
    return val ? 'Yes' : 'No';
  }

  function getTotalHours() {
    if (!request?.services?.length) return;

    const weeklyHours = request.services
      .filter((service) => service?.frequency === 'Per Week')
      .reduce((a, b) => a + b.hours, 0);

    const monthlyHours = request.services
      .filter((service) => service?.frequency === 'Per Month')
      .reduce((a, b) => a + b.hours, 0);

    if (weeklyHours && !monthlyHours) {
      return `Hours Per Week: ${weeklyHours}`;
    } else if (monthlyHours && !weeklyHours) {
      return `Hours Per Month: ${monthlyHours}`;
    } else if (weeklyHours && monthlyHours) {
      const totalWeeklyHours = Math.round(weeklyHours + monthlyHours / 4);
      return `Hours Per Week: ${totalWeeklyHours} (approximate)`;
    }
  }

  function getSortedNotes() {
    const notes = requestNotes || [];
    return sortBy(notes, (note) => new Date(note.created_at));
  }

  const renderNotes = () => {
    return getSortedNotes().map((note) => (
      <List className={styles.list} key={note.id}>
        <Notes note={note} request={request} id={request?.id} />
      </List>
    ));
  };

  return (
    <Box p={`${theme.spacing(1)}px ${theme.spacing(3)}px`}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box mb={theme.spacing(1)}>
            <Typography variant={'body2'} gutterBottom>
              Notifications
            </Typography>
            <Typography variant={'body2'}>
              {formatDate(request?.refreshed_time)} Care Request Created
            </Typography>
          </Box>

          <Box mb={theme.spacing(1)}>
            <LoadingBox loading={notesLoading}>
              <Typography variant={'body2'} gutterBottom>
                Notes
              </Typography>
              {renderNotes()}
            </LoadingBox>
          </Box>

          <FlexBox column alignItems="flex-end">
            <FormControl>
              <PlainInputLabel>Add Notes</PlainInputLabel>
              <DuettTextField
                multiline={true}
                InputProps={{
                  disableUnderline: true,
                  placeholder: `Take notes here${
                    accountType === accountTypes.AGENCY
                      ? '. Do not add client identifying information here.'
                      : ''
                  }`,
                }}
                rows={4}
                id="notes"
                name="notes"
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </FormControl>
            <FlexBox justifyContent="center" mr={8} mt={2}>
              <Button
                variant="text"
                color="primary"
                disableElevation={true}
                onClick={() => setNote('')}
                style={{ marginRight: theme.spacing(2) }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                disableElevation={true}
                onClick={submitNote} // save and refresh the current care careRequest
              >
                Save
              </Button>
            </FlexBox>
          </FlexBox>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box mb={6}>
            <Typography variant="body2" gutterBottom>
              Requested Schedule of Hours
            </Typography>
            <Typography variant="body2">{getTotalHours()}</Typography>
            <Typography variant="body2">
              The Requested hours description: {request?.requested_schedule}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" gutterBottom>
              Additional Details
            </Typography>
            <Typography variant="body2" gutterBottom>
              {request?.additional_notes}
            </Typography>
            <Typography variant="body2">
              Request Prior Authorization:{' '}
              {humanizeBool(request?.request_prior_authorization)}
            </Typography>
            <Typography variant="body2">
              Transportation Required:{' '}
              {humanizeBool(request?.transportation_required)}
            </Typography>
            <Typography variant="body2">
              Pets: {humanizeBool(request?.pets)}
            </Typography>
            <Typography variant="body2">
              Smoking: {humanizeBool(request?.smoking)}
            </Typography>
            <Typography variant="body2">
              Equipment: {humanizeBool(request?.equipment)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

CareDetails.propTypes = {
  request: PropTypes.object,
};

export default CareDetails;
