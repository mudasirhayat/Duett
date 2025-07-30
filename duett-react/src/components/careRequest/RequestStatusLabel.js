import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from '../layout/FlexBox';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  indicator: {
    width: 16,
    height: 16,
    borderRadius: 999,
    marginRight: theme.spacing(1),
  },
  open: {
    backgroundColor: theme.palette.blue.main,
  },
  pending: {
    backgroundColor: theme.palette.warning.main,
  },
  closed: {
    backgroundColor: theme.palette.error.main,
  },
  partiallyMatched: {
    backgroundColor: theme.palette.blue.main,
  },
  status: {
    textTransform: 'capitalize',
    color: theme.palette.primary.main,
    fontSize: 12,
  },
}));

// These align with the Choice options on the API
const statuses = {
  OPEN: 'Open',
  PENDING: 'Pending',
  CLOSED: 'Closed',
  NEW: 'New',
  SUBMITTED: 'Submitted',
  MATCHED: 'Matched',
  SUBMISSIONS_RECEIVED: 'Submissions Received',
  ARCHIVED: 'Archived',
  PARTIALLY_MATCHED: 'Partially Matched',
};

const RequestStatusLabel = ({ status }) => {
  const classes = useStyles();
  const {
    CLOSED,
    MATCHED,
    ARCHIVED,
    PENDING,
    SUBMITTED,
    SUBMISSIONS_RECEIVED,
    OPEN,
    NEW,
    PARTIALLY_MATCHED,
  } = statuses;
  const closed = [CLOSED, MATCHED, ARCHIVED].includes(status);
  const pending = [PENDING, SUBMITTED, SUBMISSIONS_RECEIVED].includes(status);
  const open = [OPEN, NEW].includes(status);
  const partiallyMatched = [PARTIALLY_MATCHED].includes(status);

  return (
    <FlexBox alignItems="center">
      <Box
        className={clsx(classes.indicator, {
          [classes.open]: open,
          [classes.pending]: pending,
          [classes.closed]: closed,
          [classes.partiallyMatched]: partiallyMatched,
        })}
      />
      <Typography className={classes.status}>{status}</Typography>
    </FlexBox>
  );
};

RequestStatusLabel.defaultProps = {
  status: 'Open',
};

RequestStatusLabel.propTypes = {
  status: PropTypes.oneOf(Object.entries(statuses).map((o) => o[1])),
};

export default RequestStatusLabel;
