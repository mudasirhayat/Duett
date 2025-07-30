import React from 'react';
import { TextField } from '@material-ui/core';

const DuettTextField = (props) => {
  return <TextField InputProps={{ disableUnderline: true }} {...props} />;
};

export default DuettTextField;
