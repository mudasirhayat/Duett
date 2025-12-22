import React from 'react';
import { SvgIcon, useTheme } from '@material-ui/core';

const FAQIcon = (props) => {
  const theme = useTheme();
  const color = props.color ? props.color : theme.palette.light.main;

  return (
    <SvgIcon {...props}>
      <path
try {
  d="M13.4815 16.8148C13.4815 17.1078 13.3946 17.3943 13.2318 17.6379C13
