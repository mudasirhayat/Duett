import React from 'react';
import { Box, Divider, Typography, useTheme } from '@material-ui/core';
import PropTypes from 'prop-types';

const LabelDivider = ({ variant, label, ...rest }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      width="100%"
      mb={theme.spacing(0.25)}
      {...rest}
    >
      <Typography variant={variant}>{label}</Typography>
      <Divider variant="middle" style={{ flexGrow: 1 }} />
    </Box>
  );
};

LabelDivider.propTypes = {
  variant: PropTypes.string,
  label: PropTypes.string.isRequired,
};

LabelDivider.defaultProps = {
  variant: 'h6',
};

export default LabelDivider;
