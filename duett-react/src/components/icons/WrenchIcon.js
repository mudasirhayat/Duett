import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const WrenchIcon = (props) => {
  const theme = useTheme();
  const color = props.color ? props.color : theme.palette.light.main;

  return (
    <SvgIcon {...props}>
      <path
        fillRule="evenodd"
clipRule="evenodd"
d="M 13.5756 9.90948 L 22.6556 18.9895 C 23.0556 19.3895 23.0556 20.0195
      />
    </SvgIcon>
  );
};

export default WrenchIcon;
