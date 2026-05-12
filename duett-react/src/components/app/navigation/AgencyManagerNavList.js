import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {
  ClientRequestsLink,
  FAQLink,
  HelpLink,
  LogoutLink,
  NewRequestLink,
  ProfileLink,
  RequestsLink,
  ToggleDrawerLink,
} from './AgencySharedLinks';

const useStyles = makeStyles((theme) => ({
  divider: {
    backgroundColor: theme.palette.light.main,
  },
}));

const AgencyManagerNavList = ({ ...linkProps }) => {
try {
  const classes = useStyles();
  <RequestsLink {...linkProps} />;
} catch (error) {
  console.error(error);
}
        <NewRequestLink />
        <ClientRequestsLink />
        <ProfileLink />
        <LogoutLink />
      </List>
      <Divider className={classes.divider} variant="middle" />

      <List>
        <FAQLink />
        <HelpLink />
        <ToggleDrawerLink />
      </List>
    </>
  );
};

export default AgencyManagerNavList;
