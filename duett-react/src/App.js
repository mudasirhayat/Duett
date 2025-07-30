import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'wouter';
import shallow from 'zustand/shallow';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Rollbar from 'rollbar';

import LoginPage from './views/authentication/LoginPage';
import theme from './theme';
import SiteModal from './components/app/SiteModal';
import { accountTypes, useAccountType } from './hooks/useRole';
import PasswordResetPage from './views/authentication/PasswordResetPage';
import useAuthStore from './store/auth';
import { getQueryStringValue } from './lib/helpers';
import VerifiedAppRoutes from './routes/VerfiedUserRoutes';
import Agency2FARoutes from './routes/Agency2FARoutes';
import Provider2FARoutes from './routes/Provider2FARoutes';
import AgencyVerifiedRoutes from './routes/AgencyVerifiedRoutes';

import SignupFlow from './views/signup/SignupFlow';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
}));

const UnauthedRoutes = () => {
  return (
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/reset/:uid/:token/">
        <PasswordResetPage />
      </Route>
      <Route path="/signup">
        <SignupFlow />
      </Route>
      <Route>
        <LoginPage notLoggedIn />
      </Route>
    </Switch>
  );
};

const AppRoutes = ({ token }) => {
  const accountType = useAccountType();
  let refresh = false;

  try {
    useAuthStore((state) => [state.user.twofactor.otp_2fa_enabled]);
  } catch {
    refresh = true;
  }

  if (!token && refresh) {
    localStorage.clear();
    window.location.reload();
  }

  const [otpEnabled, qrEnabled, disable2FA] = useAuthStore((state) => [
    state.user.twofactor?.otp_2fa_enabled,
    state.user.twofactor?.qr_2fa_enabled,
    state.user.twofactor?.disable_2fa,
  ]);
  const isAgency = accountType === accountTypes.AGENCY;

  const impersonate = localStorage.getItem('impersonate');

  if (impersonate) {
    if (isAgency) {
      return <AgencyVerifiedRoutes />;
    }
    return <VerifiedAppRoutes />;
  }

  const enabled2FA = otpEnabled || qrEnabled;
  const disabled2FA = disable2FA && !enabled2FA;
  const verified = localStorage.getItem('verified');

  if ((enabled2FA && verified) || disabled2FA) {
    if (isAgency) {
      return <AgencyVerifiedRoutes />;
    }
    return <VerifiedAppRoutes />;
  } else if (isAgency) {
    return <Agency2FARoutes />;
  } else {
    return <Provider2FARoutes />;
  }
};

const rollBarEnable = ['production', 'staging', 'qa'];

function App() {
  const classes = useStyles();
  const [
    authenticated,
    checkAuthentication,
    logout,
    byPassLogin,
    getUserInformation,
  ] = useAuthStore(
    (state) => [
      state.authenticated,
      state.checkAuthentication,
      state.logout,
      state.byPassLogin,
      state.getUserInformation,
    ],
    shallow
  );

  const hijackUser = async () => {
    const token = getQueryStringValue('token');
    const refreshToken = getQueryStringValue('refresh_token');
    if (token) {
      logout();
      localStorage.setItem('impersonate', true);
      byPassLogin(token, refreshToken);
      await getUserInformation();
      window.location = '/';
    }
  };

  useEffect(() => {
    hijackUser();
    if (rollBarEnable.includes(process.env.REACT_APP_HOST_ENV)) {
      new Rollbar({
        accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
        captureUncaught: true,
        captureUnhandledRejections: true,
        payload: {
          environment: process.env.REACT_APP_HOST_ENV,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!authenticated) {
      checkAuthentication();
    }
  }, [checkAuthentication, authenticated]);

  return (
    <ThemeProvider theme={theme}>
      <div className={'app ' + classes.root}>
        <CssBaseline />

        <main>
          <SiteModal />
          {authenticated ? (
            <AppRoutes token={getQueryStringValue('token')} />
          ) : (
            <UnauthedRoutes />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
