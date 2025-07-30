import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const CollapseIcon = (props) => {
  const theme = useTheme();
  const color = props.color ? props.color : theme.palette.light.main;

  return (
    <SvgIcon {...props}>
      <path
        d="M12.41 16.59L7.83 12L12.41 7.41L11 6L5 12L11 18L12.41 16.59Z"
        fill={color}
      />
      <path
        d="M19.41 16.59L14.83 12L19.41 7.41L18 6L12 12L18 18L19.41 16.59Z"
        fill={color}
      />
    </SvgIcon>
  );
};

export default CollapseIcon;
