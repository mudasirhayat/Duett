import React from 'react';
import { useMediaQuery, useTheme } from '@material-ui/core';
import QR2FAWizardMobile from './MobileQRWizard';
import QR2FAWizardDesktop from './DesktopQRWizard';

const QR2FAWizard = ({ open, setWizard }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return isMobile ? (
    <QR2FAWizardMobile open={open} setWizard={setWizard} />
  ) : (
    <QR2FAWizardDesktop open={open} setWizard={setWizard} />
  );
};

export default QR2FAWizard;
