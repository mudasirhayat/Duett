import { makeStyles, styled } from '@material-ui/core';

export const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: '50%',
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 0 0 1px rgb(16 22 26 / 40%)'
      : 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
}));

export const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage:
    'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&:before': {
    display: 'block',
    width: 16,
    height: 16,
    borderRadius: '100%',
    backgroundImage: 'radial-gradient(circle, #3F6C7B 44%, #87C7C9  63%)',
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
});

export const useStyles = makeStyles(() => ({
  flexContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
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
  menu: {
    '& .MuiMenu-paper': {
      borderRadius: '12px',
    },
  },
  formLabel: {
    '&.MuiFormLabel-root': {
      color: '#3F6C7B',
      fontSize: '18px !important',
      fontWeight: 500,
      lineHeight: '18px',
      marginBottom: '4px',
    },
  },
  formControl: {
    marginTop: '19px',
    marginLeft: '21px',
    display: 'block',
  },
  formControlLabel: {
    '&.MuiFormControlLabel-root,.MuiFormControlLabel-label ': {
      color: ' #848484',
      fontSize: '14px !important',
      fontWeight: 500,
      lineHeight: '18px',
    },
  },
  sortBox: {
    width: '178px',
    backgroundColor: '#FFF',
    position: 'absolute',
    top: 28,
    right: 0,
    left: 0,
    zIndex: 1,
    borderRadius: '12px',
    boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.12)',
  },
}));
