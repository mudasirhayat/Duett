import { TableCell, makeStyles, styled } from '@material-ui/core';

export const Cell = styled(TableCell)({
  color: '#667085',
  fontsize: '14px',
  fontHeight: 400,
  lineHeight: '20px',
  padding: '8px 8px',
});

export const useStyles = makeStyles((theme) => ({
  inputStyle: {
    padding: '5px !important',
    height: '25px',
    fontSize: '20px',
    color: ' #3F6C7B',
    fontFamily: 'Greycliff, Helvetica, sans-serif',
    fontWeight: 500,
    lineHeight: '16px',
    border: 'none',
    width: '100%',
    '&.MuiInputBase-root': {
      width: '100%',
    },
  },
  timePosted: {
    whiteSpace: 'break-spaces',
  },
  noBorder: {
    border: 'none',
  },
  form: {
    '&.MuiTextField-root': {
      marginBottom: '0px !important',
    },
    '& .MuiOutlinedInput-root': {
      width: '100%',
    },
  },
  addButton: {
    backgroundColor: '#E87B43',
    fontSize: '16px',
    width: '204px',
    height: '42px',
    fontWeight: 900,
    justifyContent: 'start',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: '#cb6c3b',
    },
  },
  newClientButton: {
    backgroundColor: '#3F6C7B',
    fontSize: '16px',
    width: '167px',
    height: '42px',
    fontWeight: 900,
    justifyContent: 'start',
    boxShadow: 'none',
  },
  searchBox: {
    display: 'flex',
    maxWidth: '733px',
    width: '100%',
    height: '40px',
    alignItems: 'center',
    gap: '7px',
    border: '1px solid #DADADA',
    paddingLeft: '14px',
    borderRadius: '40px',
  },
  searchIcon: {
    fontWeight: 300,
    color: '#C4C4C4',
    fontFamily: 'Greycliff, Helvetica, sans-serif',
    fontSize: '20px',
    lineHeight: '16px',
  },
  searchClientButton: {
    backgroundColor: '#3F6C7B',
    fontSize: '16px',
    maxWidth: '190px',
    minWidth: '150px',
    width: '100%',
    height: '40px',
    fontWeight: 900,
    justifyContent: 'center',
    boxShadow: 'none',
  },
  reset: {
    marginLeft: '8px',
    color: '#3F6C7B',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '20px',
  },
  gridTitle: {
    marginTop: '10px',
    color: '#3F6C7B',
    fontFamily: 'Greycliff, Helvetica, sans-serif',
    fontSize: '32px',
    fontWeight: 900,
    lineHeight: '30px',
  },
  newRequest: {
    display: 'flex',
    width: '100%',
    marginTop: '21px',
    justifyContent: 'end',
  },

  // Grid Styles
  grid: {
    height: 600,
    width: '100%',
  },
  row: {
    background: '#F2F9FE',
    justifyContent: 'start',
  },
  tableBody: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
  },

  // Grid Column Styles
  flexContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIconStyle: {
    cursor: 'pointer',
    '& :hover': {
      backgroundColor: '#66708524',
      borderRadius: '50%',
    },
  },
  IconButtonCaret: {
    width: '25px',
    height: '25px',
    cursor: 'pointer',
    backgroundColor: '#66708524',
    borderRadius: '50%',
  },
  sortIcon: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& :hover': {
      backgroundColor: '#66708524',
      borderRadius: '50%',
    },
  },
  tableHead: {
    padding: '8px 8px !important',
    '&:nth-child(1)': {
      paddingLeft: '32px !important',
    },
    '&:last-child': {
      paddingRight: '32px !important',
    },
  },
  statusChipStyle: {
    '@media (max-width: 1520px)': {
      whiteSpace: 'break-spaces !important',
      maxWidth: '60px !important',
    },
  },
  activeIcon: {
    '&.MuiChip-icon': {
      color: 'red',
      width: '8px',
      height: '8px',
      borderRadius: '100%',
    },
  },
  headerName: {
    color: '#667085',
    fontSize: '12px',
    fontweight: 500,
    lineheight: '18px',
  },
  columnLabel: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center',
    justifyContent: 'start',
    whiteSpace: 'nowrap',
  },
  clientName: {
    color: ' #3F6C7B',
    fontFamily: 'Greycliff',
    fontSize: '32px',
    fontWeight: 400,
    lineHeight: '30px',
  },
  chipStyle: {
    background: (styles) => styles.chip,
    display: 'inline-block',
    padding: '2px 8px 2px 6px',
    borderRadius: '16px',
  },
  statusStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  dotStyle: {
    width: '8px',
    height: '8px',
    background: (styles) => styles.dot,
    borderRadius: '100%',
  },
  textStyle: {
    color: (styles) => styles.text,
    textAlign: 'center',
    fontFamily: 'Greycliff, Helvetica, sans-serif',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '18px',
    whiteSpace: 'nowrap',
  },
  tableFlexContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: ({ hideSearch }) => (hideSearch ? 'end' : 'space-between'),
    padding: '20px 24px 19px 24px',
    gap: '16px',
    width: '100%',
    position: 'sticky',
    left: '0px',
    top: '0px',
    background: '#FFF',
  },
  tableContainer: {
    width: '100%',
    marginTop: '28px',
    borderRadius: '8px',
    border: ' 1px solid #EAECF0',
    background: '#FFF',
  },
  searchError: { textAlign: 'center', maxWidth: '500px', width: '100%' },
  loader: {
    display: 'flex',
    height: 600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationTableCell: {
    padding: '0px !important',
    border: 0,
    display: 'table-cell',
  },
  paginationTableRow: {
    paddingLeft: 0,
    // border: 0,
    borderBottom: '0.5px solid #C7D6DB',
  },
}));
