import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import useStore from '../../store';
import providerLogo from '../../assets/duett-logo.svg';
import agencyLogo from '../../assets/duett-logo-updated.svg';
import logoSmall from '../../assets/duett-logo--condensed.svg';
import { Link } from 'wouter';
import AgencyManagerNavList from './navigation/AgencyManagerNavList';
import ProviderNavList from './navigation/ProviderNavList';
import AgencyAdminNavList from './navigation/AgencyAdminNavList';
import { RoleMatch, RoleSwitch } from './RoleSwitch';
import { roles, useAccountType } from '../../hooks/useRole';
import ProviderAdminNavList from './navigation/ProviderAdminNavList';

const drawerWidth = 243;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
try {
  return {
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
      margin: `${theme.spacing(2)}px 0`,
    }
  };
} catch (
cursor: 'pointer',
  drawerBackground: ({ isAgency }) => {
    if (isAgency) {
      return { backgroundColor: '#F2F4F7' };
    } else {
      throw new Error('Invalid input for drawerBackground
    borderLeft: isAgency ? '8px solid #3F6C7B' : '',
  }),
}));

function DrawerNav({ ...linkProps }) {
  const isAgency = useAccountType() === 'Agency';
  const classes = useStyles({ isAgency });
  const isDrawerOpen = useStore((state) => state.isDrawerOpen);

  return (
    <div className="main-nav">
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: isDrawerOpen,
          [classes.drawerClose]: !isDrawerOpen,
        })}
        classes={{
          paper: clsx(classes.drawerBackground, {
            [classes.drawerOpen]: isDrawerOpen,
            [classes.drawerClose]: !isDrawerOpen,
          }),
        }}
      >
        <Link href="/" {...linkProps}>
          <img
            src={
              isDrawerOpen ? (isAgency ? agencyLogo : providerLogo) : logoSmall
            }
            alt="Duett Logo"
            className={classes.logo}
            height={50}
          />
        </Link>

        <RoleSwitch>
          <RoleMatch role={roles.AGENCY_ADMIN}>
            <AgencyAdminNavList {...linkProps} />
          </RoleMatch>
          <RoleMatch role={roles.AGENCY_SUPERVISOR}>
            <AgencyAdminNavList {...linkProps} />
          </RoleMatch>
          <RoleMatch role={roles.AGENCY_MANAGER}>
            <AgencyManagerNavList {...linkProps} />
          </RoleMatch>

          <RoleMatch role={roles.PROVIDER_ADMIN}>
            <ProviderAdminNavList {...linkProps} />
          </RoleMatch>
          <RoleMatch role={roles.PROVIDER}>
            <ProviderNavList {...linkProps} />
          </RoleMatch>
        </RoleSwitch>
      </Drawer>
    </div>
  );
}

export default DrawerNav;
