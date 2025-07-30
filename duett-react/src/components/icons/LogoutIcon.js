import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const LogoutIcon = (props) => {
  const theme = useTheme();
  const color = props.color ? props.color : theme.palette.light.main;

  return (
    <SvgIcon {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 21L5 21C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.11 3 21 3.9 21 5V7.00001H19V5L5 5L5 19L19 19V17H21V19C21 20.1 20.11 21 19 21ZM16 17L14.59 15.59L17.17 13L7.5 13L7.5 11L17.17 11L14.59 8.41L16 7L21 12L16 17Z"
        fill={color}
      />
    </SvgIcon>
  );
};

export default LogoutIcon;
