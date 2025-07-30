import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'wouter';
import useStore from '../../../store';
import { Link } from 'wouter';
import LogoutIcon from '../../icons/LogoutIcon';
import WrenchIcon from '../../icons/WrenchIcon';
import CollapseIcon from '../../icons/CollapseIcon';
import PersonIcon from '@material-ui/icons/Person';
import useAuthStore from '../../../store/auth';
import ListIcon from '@material-ui/icons/List';
import useCareRequestStore from '../../../store/careRequests';

const useStyles = makeStyles((theme) => ({
  listItemText: {
    color: theme.palette.light.main,
    minHeight: '24px',
    whiteSpace: 'normal',
  },
  collapseIconFlipped: {
    transform: 'rotate(180deg)',
  },
  icon: {
    color: theme.palette.light.main,
  },
}));

export const RequestsLink = ({ ...linkProps }) => {
  const classes = useStyles();

  return (
    <Link href="/" {...linkProps}>
      <ListItem button>
        <ListItemIcon>
          <ListIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText primary="Requests" className={classes.listItemText} />
      </ListItem>
    </Link>
  );
};

export const ProfileLink = () => {
  const classes = useStyles();
  const user = useAuthStore((state) => state.user);

  return (
    <Link href="/users/self">
      <ListItem button>
        <ListItemIcon>
          <PersonIcon className={classes.icon} />
        </ListItemIcon>
        <ListItemText
          primary={`${user.user_profile?.first_name} ${user.user_profile?.last_name}`}
          className={classes.listItemText}
        />
      </ListItem>
    </Link>
  );
};

export const LogoutLink = () => {
  const classes = useStyles();
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
    <ListItem button onClick={handleLogout}>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" className={classes.listItemText} />
    </ListItem>
  );
};

export const UsersLink = () => {
  const classes = useStyles();

  return (
    <Link href="/users">
      <ListItem button>
        <ListItemIcon>
          <WrenchIcon />
        </ListItemIcon>
        <ListItemText primary="Users" className={classes.listItemText} />
      </ListItem>
    </Link>
  );
};

export const ToggleDrawerLink = () => {
  const classes = useStyles();
  const isDrawerOpen = useStore((state) => state.isDrawerOpen);
  const toggleDrawer = useStore((state) => state.toggleDrawer);

  return (
    <ListItem button onClick={toggleDrawer}>
      <ListItemIcon>
        <CollapseIcon
          className={clsx({
            [classes.collapseIconFlipped]: !isDrawerOpen,
          })}
        />
      </ListItemIcon>
      <ListItemText primary="Collapse" className={classes.listItemText} />
    </ListItem>
  );
};
