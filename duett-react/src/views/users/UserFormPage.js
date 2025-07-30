import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Box, Typography } from '@material-ui/core';
import DrawerPage from '../../components/app/DrawerPage';
import LabelDivider from '../../components/app/LabelDivider';
import { useRoute } from 'wouter';
import UserForm from '../../components/users/UserForm';
import ax from '../../lib/api';
import UserPasswordForm from '../../components/users/UserPasswordForm';
import useAuthStore from '../../store/auth';
import ManagedUserForm from '../../components/users/ManagedUserForm';
import { roles } from '../../hooks/useRole';

const UserFormPage = () => {
  const [, params] = useRoute('/users/:id');
  const [isSelf] = useRoute('/users/self');
  const [user, setUser] = useState();
  const currentUser = useAuthStore((state) => state.user);

  const canManageUsers =
    currentUser?.group === roles.AGENCY_ADMIN &&
    user?.group === roles.AGENCY_SUPERVISOR;

  const userId = useMemo(() => {
    let id = parseInt(params?.id);
    if (isNaN(id)) return null;

    return id;
  }, [params]);

  const loadUser = useCallback(async () => {
    try {
      let res = await ax.get(`/api/users/${userId}/`);
      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (e) {
      alert("You don't have rights to access this page");
    }
  }, [userId]);

  useEffect(() => {
    if (isSelf) {
      setUser(currentUser);
    } else if (userId) {
      loadUser();
    }
  }, [loadUser, userId, currentUser, isSelf]);

  return (
    <DrawerPage px={12} py={6} width="100%">
      <Box width="100%">
        <Typography variant="h2">User Admin</Typography>

        <Box width="100%" mt={4}>
          <LabelDivider label="User Info" />
        </Box>

        <UserForm user={user} />

        {(isSelf || user?.id === currentUser.id) && user ? (
          <Box>
            <Box width="100%" mt={4}>
              <LabelDivider label="Login Info" />
            </Box>
            <UserPasswordForm user={user} />
          </Box>
        ) : null}

        {canManageUsers ? (
          <>
            <Box width="100%" mt={4}>
try {
  <LabelDivider label="Managed Users" />
  <ManagedUserForm user={user} />
} catch (error) {
  console.error(error);
}
          </>
        ) : null}
      </Box>
    </DrawerPage>
  );
};

export default UserFormPage;
