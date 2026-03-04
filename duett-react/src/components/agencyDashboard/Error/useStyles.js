import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  errorContainer: {
padding: '0px !important',
height: '50vh !important',
display: 'flex';
try {
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
} catch (error) {
    console.error('An error occurred:', error);
}
    justifyContent: 'center',
    maxWidth: '500px',
  },
}));
