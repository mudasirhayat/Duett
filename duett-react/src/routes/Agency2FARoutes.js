import React from 'react';
import { Switch, Route, Redirect } from 'wouter';
import shallow from 'zustand/shallow';
import DashboardPage from '../views/dashboard/DashboardPage';
import useAuthStore from '../store/auth';
import ConfigureOTP from '../views/authentication/SMSBased2FA/ConfigureOTP';
import VerifyOTP from '../views/authentication/SMSBased2FA/VerifyOTP';
import ConfigureQR from '../views/authentication/QRBased2FA/ConfigureQR';
import VerifyQR from '../views/authentication/QRBased2FA/VerifyQR';
import VerifiedAppRoutes from './VerfiedUserRoutes';
import AgencyVerifiedRoutes from './AgencyVerifiedRoutes';

const Agency2FARoutes = () => {
  const [otpEnabled, qrEnabled] = useAuthStore(
    (state) => [
      state.user.twofactor?.otp_2fa_enabled,
      state.user.twofactor?.qr_2fa_enabled,
    ],
    shallow
  );
  const configuring = !!localStorage.getItem('configure');
  const isVerified = localStorage.getItem('verified');
  const enabled = otpEnabled || qrEnabled;

  if (!enabled) {
    return (
      <Switch>
        <Route path="/">
          <DashboardPage />
        </Route>
        <Route path="/configure-2FA">
          <ConfigureOTP />
        </Route>
        {configuring && (
          <Route path="/verify-otp">
            <VerifyOTP />
          </Route>
        )}
        <Route path="/configure-qr">
          <ConfigureQR />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else if (otpEnabled && !isVerified) {
    return (
      <Switch>
        <Route path="/verify-otp">
          <VerifyOTP />
        </Route>
        <Redirect to="/verify-otp" />
      </Switch>
    );
  } else if (qrEnabled && !isVerified) {
    return (
      <Switch>
        <Route path="/verify-qr">
          <VerifyQR />
        </Route>
        <Redirect to="/verify-qr" />
      </Switch>
    );
  } else {
    return <AgencyVerifiedRoutes />;
  }
};

export default Agency2FARoutes;
