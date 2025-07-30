import React from 'react';
import { Box, CircularProgress, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from './FlexBox';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

const LoadingBox = ({ loading, children, ...rest }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root} {...rest}>
      {loading ? (
        <FlexBox width="100%" alignItems="center" justifyContent="center">
          <CircularProgress />
        </FlexBox>
      ) : (
        children
      )}
    </Box>
  );
};

LoadingBox.propTypes = {
  loading: PropTypes.bool,
};

LoadingBox.defaultProps = {};

export default LoadingBox;
