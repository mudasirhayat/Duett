import React from 'react';
import PropTypes from 'prop-types';
import { useAccountType, useRole } from '../../hooks/useRole';

const isRoleMatch = (element) => {
  return element.type === RoleMatch;
};

export const RoleMatch = ({ children }) => {
  return children;
};

RoleMatch.propTypes = {
  role: PropTypes.string.isRequired,
};

export const RoleSwitch = ({ children, account }) => {
  const role = useRole();
  const accountType = useAccountType();

  // Match based on Role or Account Type based on `account` prop
  const matchName = account ? accountType : role;

  children = Array.isArray(children) ? children : [children];

  for (const element of children) {
    if (isRoleMatch(element) && element.props.role === matchName)
      return React.cloneElement(element);
  }

  return null;
};

RoleSwitch.propTypes = {
  account: PropTypes.bool,
};
