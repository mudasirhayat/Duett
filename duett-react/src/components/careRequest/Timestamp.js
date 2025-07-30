import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 0,
    fontSize: 12,
    color: theme.palette.primary.main,
  },
  warning: {
    color: theme.palette.warning.main,
  },
  expired: {
    color: theme.palette.error.main,
  },
  none: {
    color: theme.palette.light.main,
  },
}));

const Timestamp = ({ expired, none, warning, children }) => {
  const classes = useStyles();

  return (
    <Typography
      className={clsx(classes.root, {
        [classes.none]: none,
        [classes.warning]: warning,
        [classes.expired]: expired,
      })}
    >
      {children}
    </Typography>
  );
};

Timestamp.defaultProps = {};

Timestamp.propTypes = {
  none: PropTypes.bool,
  warning: PropTypes.bool,
  expired: PropTypes.bool,
};

export default Timestamp;
