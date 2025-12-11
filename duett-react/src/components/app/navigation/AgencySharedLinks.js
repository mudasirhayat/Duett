import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import clsx from 'clsx';
import { useLocation } from 'wouter';
import useStore from '../../../store';
import { Link } from 'wouter';
import LogoutIcon from '../../icons/LogoutIcon';
import ClipboardIcon from '../../icons/ClipboardIcon';
import CollapseIcon from '../../icons/CollapseIcon';
import PersonIcon from '@material-ui/icons/Person';
import useAuthStore from '../../../store/auth';
import useCareRequestStore from '../../../store/careRequests';
import ProfileIcon from '../../icons/ProfileIcon';
import FAQIcon from '../../icons/FAQIcon';
import HelpIcon from '../../icons/HelpIcon';
import ManageIcon from '../../icons/ManageIcon';
import AddIcon from '../../icons/AddIcon';
import { useStyles, iconColor } from './useStyles';
import { Tooltip } from '@material-ui/core';
import shallow from 'zustand/shallow';
import useFilterSortStore from '../../../store/utility';
import useAgencyRequestStore from '../../../store/agencyRequest';

const useCustomStore = () => {
  const isDrawerOpen = useStore((state) => state.isDrawerOpen);

  return { isDrawerOpen };
};

const ItemContainer = ({ children, ...props }) => {
  const { isDrawerOpen } = useCustomStore();
  const classes = useStyles();
  return (
    <ListItem
      button
      {...props}
      className={clsx({
        [classes.setPadding]: !isDrawerOpen,
      })}
    >
      {children}
    </ListItem>
  );
};

const ItemTextContainer = ({ ...linkProps }) => {
  const classes = useStyles();
  const { isDrawerOpen } = useCustomStore();

  return (
    <ListItemText
      style={{ whiteSpace: 'nowrap' }}
      className={clsx({
        [classes.listItemText]: isDrawerOpen,
        [classes.listItemTextClose]: !isDrawerOpen,
      })}
      {...linkProps}
    />
  );
};

const ItemIconContainer = ({ toolText, children }) => {
  const { isDrawerOpen } = useCustomStore();
  const classes = useStyles();

  return (
    <ListItemIcon
      style={{ justifyContent: 'center' }}
      className={clsx({
        [classes.setStyle]: !isDrawerOpen,
        [classes.iconPadding]: !isDrawerOpen,
      })}
    >
      {!isDrawerOpen ? (
        <Tooltip title={toolText} placement="right">
          <span>{children}</span>
        </Tooltip>
      ) : (
        children
      )}
    </ListItemIcon>
  );
};

export const RequestsLink = ({ ...linkProps }) => {
  const { id } = JSON.parse(localStorage.getItem('CURRENT_USER'));
  const { loadingRequests, resetGrid, setSearching } = useAgencyRequestStore();

  const newHandleClick = () => {
    if (loadingRequests) return;
    resetGrid(true, 'requests');
    setSearching(false);
  };

  return (
    <Link href="/" {...linkProps} onClick={newHandleClick}>
      <ItemContainer button>
        <ItemIconContainer toolText="Care Requests">
          <ClipboardIcon color={iconColor} />
      </ItemIconContainer>
      <ItemTextContainer primary="Care Requests" />
    </ItemContainer>
    </Link>
  );
};

export const ProfileLink = () => {
  return (
    <Link href="/users/self">
      <ItemContainer button>
        <ItemIconContainer toolText="My Profile">
          <PersonIcon color={iconColor} />
        </ItemIconContainer>
        <ItemTextContainer primary="My Profile" />
      </ItemContainer>
    </Link>
  );
};

export const LogoutLink = () => {
  const logout = useAuthStore((state) => state.logout);
  const [clearOutFilter] = useCareRequestStore((state) => [
    state.clearOutFilter,
  ]);
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    logout();
    clearOutFilter();
    setLocation('/');
  };

  return (
    <ItemContainer button onClick={handleLogout}>
      <ItemIconContainer toolText="Logout">
        <LogoutIcon color={iconColor} />
      </ItemIconContainer>
      <ItemTextContainer primary="Logout" />
    </ItemContainer>
  );
};

export const ManageUsersLink = () => {
  return (
    <Link href="/users">
      <ItemContainer button>
        <ItemIconContainer toolText="Manage Users">
          <ManageIcon color={iconColor} />
        </ItemIconContainer>
        <ItemTextContainer primary="Manage Users" />
      </ItemContainer>
    </Link>
  );
};

export const NewRequestLink = () => {
  return (
    <Link href="/request/new">
      <ItemContainer button>
        <ItemIconContainer toolText="New Care Request">
          <AddIcon color={iconColor} />
        </ItemIconContainer>
        <ItemTextContainer primary="New Care Request" />
      </ItemContainer>
    </Link>
  );
};

export const ClientRequestsLink = () => {
  const { id } = JSON.parse(localStorage.getItem('CURRENT_USER'));
  const { loadingRequests, resetGrid, setSearching } = useAgencyRequestStore();

  const newHandleClick = () => {
    if (loadingRequests) return;
    resetGrid(true, 'clients');
    setSearching(false);
  };

  return (
    <Link href="/clients" onClick={newHandleClick}>
      <ItemContainer button>
        <ItemIconContainer toolText="Clients">
          <ProfileIcon color={iconColor} />
        </ItemIconContainer>
        <ItemTextContainer primary="Clients" />
      </ItemContainer>
    </Link>
  );
};

export const FAQLink = () => {
  return (
    <ItemContainer
      button
      onClick={() => {
        window.open('https://www.duett.io/faqs', '_blank');
      }}
    >
      <ItemIconContainer toolText="FAQ's">
        <FAQIcon color={iconColor} />
      </ItemIconContainer>
      <ItemTextContainer primary="FAQ's" />
    </ItemContainer>
  );
};

export const HelpLink = () => {
  return (
    <ItemContainer
      button
      onClick={() => {
        window.location.href = 'mailto:support@duett.io';
      }}
    >
      <ItemIconContainer toolText="Need Help">
        <HelpIcon color={iconColor} />
      </ItemIconContainer>
      <ItemTextContainer primary="Need Help" />
    </ItemContainer>
  );
};

export const ToggleDrawerLink = () => {
  const classes = useStyles();
  const isDrawerOpen = useStore((state) => state.isDrawerOpen);
  const toggleDrawer = useStore((state) => state.toggleDrawer);

  return (
    <ItemContainer button onClick={toggleDrawer}>
      <ItemIconContainer toolText="Expand">
        <CollapseIcon
          color={iconColor}
          className={clsx({
            [classes.collapseIconFlipped]: !isDrawerOpen,
          })}
        />
      </ItemIconContainer>
      <ItemTextContainer primary="Collapse" />
    </ItemContainer>
  );
};
