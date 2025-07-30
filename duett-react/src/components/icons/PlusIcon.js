import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const PlusIcon = (props) => {
  const theme = useTheme();
  const color = props.color ? props.color : theme.palette.primary.main;

  return (
    <SvgIcon {...props}>
      <path
        d="M13.5 7H11.5V11H7.5V13H11.5V17H13.5V13H17.5V11H13.5V7ZM12.5 2C6.98 2 2.5 6.48 2.5 12C2.5 17.52 6.98 22 12.5 22C18.02 22 22.5 17.52 22.5 12C22.5 6.48 18.02 2 12.5 2ZM12.5 20C8.09 20 4.5 16.41 4.5 12C4.5 7.59 8.09 4 12.5 4C16.91 4 20.5 7.59 20.5 12C20.5 16.41 16.91 20 12.5 20Z"
        fill={color}
      />
    </SvgIcon>
  );
};

export default PlusIcon;
