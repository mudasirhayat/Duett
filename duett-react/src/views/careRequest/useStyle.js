import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';

const useStyles = makeStyles({
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '60px',
    height: '34px',
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    transition: '.4s',
    borderRadius: '34px',
  },
  sliderChecked: {
    backgroundColor: '#2196F3',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  icon: {
    transition: 'transform .4s',
  },
  iconChecked: {
    transform: 'translateX(26px)',
  },
  svgIcon: {
    position: 'absolute',
    width: '26px',
    height: '26px',
    transition: 'transform .4s',
  },
});
