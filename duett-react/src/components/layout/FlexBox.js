import React from 'react';
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';

const FlexBox = ({ column, children, ...rest }) => {
  const flexDirection = column ? 'column' : 'row';

  return (
    <Box display="flex" flexDirection={flexDirection} {...rest}>
      {children}
    </Box>
  );
};

FlexBox.propTypes = {
  column: PropTypes.bool,
};

export default FlexBox;
