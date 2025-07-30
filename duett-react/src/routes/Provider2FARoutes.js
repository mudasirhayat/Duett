import React from 'react';
import { Switch, Route, Redirect } from 'wouter';
import shallow from 'zustand/shallow';
import DashboardPage from '../views/dashboard/DashboardPage';
import useAuthStore from '../store/auth';
import { isMoreThanTwoWeeks } from '../lib/helpers';
import ConfigureOTP from '../views/authentication/SMSBased2FA/ConfigureOTP';
import VerifyOTP from '../views/authentication/SMSBased2FA/VerifyOTP';
import VerifiedAppRoutes from './VerfiedUserRoutes';

const Provider2FARoutes = () => {
  const [otpEnabled, promptedDate] = useAuthStore(
    (state) => [
      state.user.twofactor?.otp_2fa_enabled,
      state.user.twofactor?.last_prompted_provider,
    ],
    shallow
  );
  const configuring = !!localStorage.getItem('configure');
  const isVerified = localStorage.getItem('verified');
  const providerPrompted = isMoreThanTwoWeeks(promptedDate);
  const allowConfigure = !otpEnabled && providerPrompted;

  if (allowConfigure) {
    return (
      <Switch>
        <Route path="/configure-2FA">
          <ConfigureOTP />
        </Route>
        {configuring && (
          <Route path="/verify-otp">
            <VerifyOTP />
          </Route>
        )}
        <Route path="/">
          <DashboardPage />
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
  } else {
    return <VerifiedAppRoutes />;
  }
};

export default Provider2FARoutes;
