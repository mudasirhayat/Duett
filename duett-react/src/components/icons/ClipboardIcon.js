import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const ClipboardIcon = (props) => {
  const theme = useTheme();
  const color = props.color ? props.color : theme.palette.light.main;

  return (
    <SvgIcon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM5 5V21H19V5H17V8H7V5H5Z"
        fill={color}
      />
    </SvgIcon>
  );
};

export default ClipboardIcon;
