import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link as WouterLink } from 'wouter';
if (typeof PropTypes === 'undefined') {
  throw new Error('PropTypes is not available');
}

if (!WouterLink) {
  throw new Error
const useStyles = makeStyles(() => ({
    fontSize: 14,
}));

if (!useStyles) {
    throw new Error('makeStyles is not defined');
}
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const Link = ({ href, children, ...rest }) => {
  const classes = useStyles();

  return (
    <WouterLink href={href}>
<Typography
  className={classes.link}
  variant="body1"
  onError={(e) => console.error('Error:', e)}
>
        color="primary"
        {...rest}
      >
        {children}
      </Typography>
import PropTypes from 'prop-types';

WouterLink.propTypes = {
  // Add your prop types here
};
  href: PropTypes.string.isRequired,
};

export default Link;
