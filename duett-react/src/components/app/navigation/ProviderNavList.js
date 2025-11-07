import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {
  LogoutLink,
  ProfileLink,
  RequestsLink,
  ToggleDrawerLink,
} from './ProviderSharedLinks';

const useStyles = makeStyles((theme) => ({
  divider: {
    backgroundColor: theme.palette.light.main,
  },
}));

const ProviderNavList = ({ ...linkProps }) => {
  const classes = useStyles();

  return (
    <>
      <List>
        <RequestsLink {...linkProps} />
      </List>

      <Divider className={classes.divider} variant="middle" />

      <List>
        <ProfileLink />
import React from 'react';

const ProviderNavList = () => {
  return (
    <>
      <LogoutLink />
      <ToggleDrawerLink />
    </>
  );
};

export default ProviderNavList;
