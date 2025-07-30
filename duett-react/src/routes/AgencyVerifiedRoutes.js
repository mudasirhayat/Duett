import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'wouter';
import shallow from 'zustand/shallow';
import { accountTypes, roles, useAccountType, useRole } from '../hooks/useRole';
import useAuthStore from '../store/auth';
import LoadingBox from '../components/layout/LoadingBox';
import RequestCreatePage from '../views/careRequest/RequestCreatePage';
import RequestEditPage from '../views/careRequest/RequestEditPage';
import RequestDetailPage from '../views/careRequest/RequestDetailPage';
import UserFormPage from '../views/users/UserFormPage';
import UsersPage from '../views/users/UsersPage';
import Page503 from '../views/Page503';
import Page404 from '../views/404Page';
import ClientDashboard from '../views/dashboard/ClientDashboard.js';
import ClientHistoryDashboard from '../views/dashboard/ClientHistoryPage/index.js';
import RequestsDashboard from '../views/dashboard/RequestDashboard/index.js';
import DashboardPage from '../views/dashboard/DashboardPage.js';

const AgencyVerifiedRoutes = () => {
  const role = useRole();
  const accountType = useAccountType();

  const [loading] = useAuthStore((state) => [state.getUserLoading], shallow);
  const isAgency = accountType === accountTypes.AGENCY;
  const usersEnable = [
    roles.AGENCY_ADMIN,
    roles.PROVIDER_ADMIN,
    roles.AGENCY_SUPERVISOR,
  ];
  const isAdmin = usersEnable.includes(role);

  return (
    <LoadingBox loading={loading}>
      <Switch>
        <Route exact path="/">
          <RequestsDashboard />
          {/* <DashboardPage /> */}
        </Route>
        {isAgency && (
          <Route exact path="/request/new" component={RequestCreatePage} />
        )}
        {isAgency && (
          <Route exact path="/request/edit/:id" component={RequestEditPage} />
        )}
        <Route path="/request/:id">
          <RequestDetailPage />
        </Route>
        <Route path="/users/self">
          <UserFormPage />
        </Route>

        <Route path="/clients">
          <ClientDashboard />
        </Route>

        <Route path="/client-history/:name/:id/">
          <ClientHistoryDashboard />
        </Route>
        {/* Only a Route component can be directly nested under a Switch, so these 3 cannot be combined. */}
        {isAdmin && (
          <Route path="/users">
            <UsersPage />
          </Route>
        )}

        {isAdmin && (
          <Route path="/users/:id">
            <UserFormPage />
          </Route>
        )}

        {isAdmin && (
          <Route path="/users/new">
            <UserFormPage />
          </Route>
        )}

        <Redirect exact from="/verify-otp" to="/" />

        <Redirect exact from="/configure-2FA" to="/" />

        <Redirect exact path="/configure-qr" to="/" />

        <Redirect path="/validate-qr" to="/" />

        <Route path="/503">
          <Page503 />
        </Route>

        <Route>
          <Page404 />
        </Route>
      </Switch>
    </LoadingBox>
  );
};

export default AgencyVerifiedRoutes;
