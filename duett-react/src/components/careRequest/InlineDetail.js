import React from 'react';
import { InputLabel, makeStyles, Typography, Tooltip } from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from '../layout/FlexBox';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  label: {
    minWidth: 96,
    fontSize: 12,
  },
  detail: {
    color: theme.palette.primary.main,
    fontSize: 12,
  },
}));

const InlineDetail = ({ label, detail, customClassLabel }) => {
  const classes = useStyles();

  return detail === 'N/A' ? (
    <Tooltip title="Care Manager has opted not to share their contact information. Care Manager contact information will be available if you've been matched to a service">
      <div>
        <FlexBox alignItems="center">
          <InputLabel className={clsx(classes.label, customClassLabel)}>
            {label}
          </InputLabel>
          <Typography className={classes.detail}>{detail}</Typography>
        </FlexBox>
      </div>
    </Tooltip>
  ) : (
    <FlexBox alignItems="center">
      <InputLabel className={clsx(classes.label, customClassLabel)}>
        {label}
      </InputLabel>
      <Typography className={classes.detail}>{detail}</Typography>
    </FlexBox>
  );
};

InlineDetail.propTypes = {
  label: PropTypes.string.isRequired,
  detail: PropTypes.string.isRequired,
  customClassLabel: PropTypes.string,
};

export default InlineDetail;
