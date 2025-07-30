import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  errorContainer: {
    padding: '0px !important',
    height: '50vh !important',
  },
  error: {
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
  },
  text: {
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '500px',
  },
}));
