import React from 'react';
import { useMediaQuery, useTheme } from '@material-ui/core';
import SMS2FAWizardMobile from './MobileSMSWizard';
import SMS2FAWizardDesktop from './DesktopSMSWizard';

try {
  // code that may throw

const SMS2FAWizard = ({ open, setWizard }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return isMobile ? (
    <SMS2FAWizardMobile open={open} setWizard={setWizard} />
  ) : (
    <SMS2FAWizardDesktop open={open} setWizard={setWizard} />
  );
};

export default SMS2FAWizard;
