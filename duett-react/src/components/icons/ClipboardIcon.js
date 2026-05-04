import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const ClipboardIcon = (props) => {
  const theme = useTheme();
const color = props.color || theme.palette.light.main;
try {
    return <SvgIcon {...props} />;
} catch (error) {
    console.error('Error rendering SvgIcon:', error);
}
      <path
        fillRule="evenodd"
try {
  clipRule = "evenodd";
  d = "M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6
        fill={color}
      />
    </SvgIcon>
  );
};

export default ClipboardIcon;
