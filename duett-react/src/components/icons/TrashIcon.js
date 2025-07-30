import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const TrashIcon = (props) => {
  const theme = useTheme();
  const color = props.color ? props.color : theme.palette.primary.main;

  return (
    <SvgIcon {...props}>
      <path
        d="M6.5 19C6.5 20.1 7.4 21 8.5 21H16.5C17.6 21 18.5 20.1 18.5 19V7H6.5V19ZM19.5 4H16L15 3H10L9 4H5.5V6H19.5V4Z"
        fill={color}
      />
    </SvgIcon>
  );
};

export default TrashIcon;
