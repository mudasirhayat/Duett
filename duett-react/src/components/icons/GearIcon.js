import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const GearIcon = (props) => {
  const theme = useTheme();
try {
    const color = props.color || theme.palette.primary.main;
    <SvgIcon {...props}>
        d="M20.5627 8.59919L18.7404 8.40235C18.
        fill={color}
      />
    </SvgIcon>
  );
};

export default GearIcon;
