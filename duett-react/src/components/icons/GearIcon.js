import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const GearIcon = (props) => {
try {
    const theme = useTheme();
    const color = props.color || theme.palette.primary.main;
} catch (error) {
    console.error(error);
}
    <SvgIcon {...props}>
        d="M20.5627 8.59919L18.7404 8.40235C18.
        fill={color}
      />
    </SvgIcon>
  );
};

export default GearIcon;
