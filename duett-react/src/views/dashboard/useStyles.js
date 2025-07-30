import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  tableFlexContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px 19px 24px',
    gap: '16px',
    width: '100%',
    left: '0px',
    top: '0px',
    background: '#FFF',
  },
  tableContainer: {
    width: '100%',
    marginTop: '28px',
    borderRadius: '8px',
    // border: ' 1px solid #EAECF0',
    background: '#FFF',
  },
  searchError: { textAlign: 'center', maxWidth: '500px', width: '100%' },
  loader: {
    display: 'flex',
    height: 600,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
