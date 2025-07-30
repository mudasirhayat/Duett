import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const PencilIcon = (props) => {
  const theme = useTheme();
  const color = props.color ? props.color : theme.palette.primary.main;

  return (
    <SvgIcon {...props}>
      <path
        d="M1.625 9.34413V11.3754H3.65625L9.64708 5.38454L7.61583 3.35329L1.625 9.34413ZM11.2179 3.81371C11.4292 3.60246 11.4292 3.26121 11.2179 3.04996L9.95042 1.78246C9.73917 1.57121 9.39792 1.57121 9.18667 1.78246L8.19542 2.77371L10.2267 4.80496L11.2179 3.81371Z"
        fill={color}
      />
    </SvgIcon>
  );
};

export default PencilIcon;
