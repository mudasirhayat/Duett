import useAuthStore from '../store/auth';

// These must match the role names in the database
export const roles = {
  AGENCY_ADMIN: 'Care Agency Admin',
  AGENCY_SUPERVISOR: 'Care Manager Supervisor',
  AGENCY_MANAGER: 'Care Manager',
  PROVIDER_ADMIN: 'Care Provider Admin',
  PROVIDER: 'Care Provider',
  UNAUTHED: 'Unauthed',
};

export const accountTypes = {
  AGENCY: 'Agency',
  PROVIDER: 'Provider',
  UNAUTHED: 'Unauthed',
};

export const useRole = () => {
  const user = useAuthStore((state) => state.user);
  if (user?.group) {
    return user.group;
  }
  return roles.UNAUTHED;
};

/**
 * Get the Account Type based on the user's role
 * @returns {string}
 */
export const useAccountType = () => {
  const role = useRole();
  let accountType;
  switch (role) {
    case roles.AGENCY_ADMIN:
    case roles.AGENCY_MANAGER:
    case roles.AGENCY_SUPERVISOR:
      accountType = accountTypes.AGENCY;
      break;
    case roles.PROVIDER_ADMIN:
    case roles.PROVIDER:
      accountType = accountTypes.PROVIDER;
      break;
    default:
      accountType = accountTypes.UNAUTHED;
      break;
  }

  return accountType;
};
