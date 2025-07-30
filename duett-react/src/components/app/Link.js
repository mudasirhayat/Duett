import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Link as WouterLink } from 'wouter';

const useStyles = makeStyles(() => ({
  link: {
    fontSize: 14,
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
        color="primary"
        {...rest}
      >
        {children}
      </Typography>
    </WouterLink>
  );
};

Link.propTypes = {
  href: PropTypes.string.isRequired,
};

export default Link;
