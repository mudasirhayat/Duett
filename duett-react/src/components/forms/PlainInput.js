import React from 'react';
import { Input } from '@material-ui/core';

const PlainInput = (props) => {
  return <Input disableUnderline={true} {...props} />;
};

export default PlainInput;
