import React from 'react';
import { Box, Button, CircularProgress, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const progressSize = 16;

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: `-${progressSize / 2}px`,
    marginLeft: `-${progressSize / 2}px`,
  },
}));

const LoadingButton = ({ loading, children, ...rest }) => {
  const classes = useStyles();

  return (
    <Box className={classes.wrapper}>
      <Button disabled={loading} {...rest}>
        {children ? children : 'Submit'}
      </Button>
      {loading && (
        <CircularProgress
          size={progressSize}
          className={classes.buttonProgress}
        />
      )}
    </Box>
  );
};

LoadingButton.propTypes = {
  loading: PropTypes.bool,
};

LoadingButton.defaultProps = {};

export default LoadingButton;
