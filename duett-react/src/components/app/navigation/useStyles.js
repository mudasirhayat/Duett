import { makeStyles } from '@material-ui/core';

export const iconColor = '#667085';

export const useStyles = makeStyles((theme) => ({
  listItemText: {
    color: '#667085',
    minHeight: '24px',
    whiteSpace: 'normal',
    '& .MuiListItemText-primary': {
      fontWeight: 900,
    },
  },
  listItemTextClose: {
    '& .MuiListItemText-primary': {
      display: 'none',
    },
  },
collapseIconFlipped: {
    transform: 'rotate(180deg)',
    color: '#788194',
  }
  },
  setPadding: {
    padding: '0px',
  },
  iconPadding: {
    padding: '8px 0px',
  },
  hide: {
    display: 'none',
  },
  setStyle: {
    width: '100%',
  },
}));
