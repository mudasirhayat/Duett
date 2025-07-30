import { createTheme } from '@material-ui/core/styles';

import GreycliffMedium from './assets/fonts/Greycliff-Medium.ttf';
import GreycliffBold from './assets/fonts/Greycliff-Bold.ttf';
import GreycliffExtraBold from './assets/fonts/Greycliff-ExtraBold.ttf';

const borderRadius = 4;

const greycliff = {
  medium: {
    fontFamily: 'Greycliff',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 'normal',
    src: `
      local('Greycliff'),
      local('Greycliff-Medium'),
      url(${GreycliffMedium}) format('truetype')
    `,
  },
  bold: {
    fontFamily: 'Greycliff',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 700,
    src: `
      local('Greycliff-Bold'),
      url(${GreycliffBold}) format('truetype')
    `,
  },
  extraBold: {
    fontFamily: 'Greycliff',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 900,
    src: `
      local('Greycliff-ExtraBold'),
      url(${GreycliffExtraBold}) format('truetype')
    `,
  },
};

const colors = {
  blue: '#3F6C7B',
  lightBlue: '#87C7C9',
  orange: '#E87B43',
  red: '#f14344',
  yellow: '#F3BB1C',
  green: '#4CBA38',
  light: '#C7D6DB',
};

const defaultTheme = createTheme();

export default createTheme({
  palette: {
    primary: {
      light: '#6d9aaa',
      main: colors.blue,
      dark: '#0d414f',
    },
    secondary: {
      main: colors.orange,
    },
    error: {
      main: colors.red,
    },
    warning: {
      main: colors.yellow,
    },
    info: {
      main: colors.yellow,
    },
    success: {
      main: colors.green,
    },
    light: {
      main: colors.light,
    },
    blue: {
      main: colors.lightBlue,
    },
  },
  typography: {
    fontFamily: 'Greycliff, Helvetica, sans-serif',
    h2: {
      fontSize: 25,
      color: colors.blue,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [greycliff.medium, greycliff.bold, greycliff.extraBold],
        '.Mui-disabled': { opacity: 0.5 },
        '.Mui-selected': { background: colors.light },
      },
    },
    MuiFormControl: {
      root: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        flexWrap: 'wrap',
        marginBottom: defaultTheme.spacing(4),
        [defaultTheme.breakpoints.down('md')]: {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      },
    },
    MuiInput: {
      root: {
        backgroundColor: 'white',
        padding: '4px 8px',
        borderRadius: borderRadius,
        border: `1px solid ${colors.light}`,
        flex: 1,
        marginRight: 56,
        height: 36,
        [defaultTheme.breakpoints.down('md')]: {
          width: '100%',
        },
      },
      formControl: {
        marginTop: '0px !important',
      },
      input: {
        fontSize: 12,
      },
      multiline: {
        height: 'auto',
        marginTop: `${defaultTheme.spacing(1)}px !important`,
      },
    },
    MuiSelect: {
      root: {
        [defaultTheme.breakpoints.down('md')]: {
          width: '100%',
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: 999,
        textTransform: 'none',
      },
      containedPrimary: {
        color: 'white',
      },
      containedSecondary: {
        color: 'white',
      },
      contained: {
        '&.Mui-disabled': {
          //  TODO: Use the same color as button, but make it less opaque
        },
      },
    },
    MuiDrawer: {
      paper: {
        backgroundColor: '#3F6C7B',
        borderLeft: '10px solid #E87B43',
      },
    },
    MuiTypography: {
      h5: {
        color: colors.blue,
      },
      h6: {
        color: colors.blue,
        fontWeight: 'lighter',
      },
      subtitle2: {
        color: 'black',
        opacity: 0.45,
        fontSize: 12,
        fontWeight: 'lighter',
      },
      subtitle1: {
        fontWeight: 'bold',
      },
      body2: {
        fontSize: 14,
        color: colors.blue,
      },
      gutterBottom: {
        marginBottom: 12,
      },
    },
    MuiInputLabel: {
      root: {
        color: colors.blue,
        [defaultTheme.breakpoints.down('md')]: {
          marginBottom: defaultTheme.spacing(1),
        },
      },
      formControl: {
        width: 128,
        marginRight: defaultTheme.spacing(1),
        fontSize: 12,
        position: 'relative',
        transform: 'none',
      },
      shrink: {
        transform: 'none',
      },
    },
    MuiFormHelperText: {
      root: {
        flexBasis: '100%',
        marginLeft: 136,
        marginRight: 56,
      },
    },
    MuiTableContainer: {
      root: {
        width: '100%',
        // overflowX: 'auto',
      },
    },
    MuiTable: {
      root: {
        border: 0,
        borderTop: `1px solid ${colors.light}`,
      },
    },
    MuiTableRow: {
      root: {
        height: 50,
        borderLeft: `1px solid ${colors.light}`,
        borderRight: `1px solid ${colors.light}`,
      },
    },
    MuiTableCell: {
      root: {
        padding: defaultTheme.spacing(1),
        '&:nth-child(1)': {
          paddingLeft: defaultTheme.spacing(4),
        },
      },
      head: {
        padding: '24px 16px 8px',
        color: colors.blue,
      },
      body: {
        padding: '8px 16px',
      },
    },
    MuiTablePagination: {
      root: {
        display: 'block',
        borderWidth: 0,
      },
      spacer: {
        flex: 0,
      },
      toolbar: {
        borderWidth: 0,
      },
      caption: {
        color: colors.blue,
        fontWeight: 'bold',
        '&:nth-of-type(2)': {
          flexGrow: 1,
          textAlign: 'right',
        },
      },
      select: {
        color: colors.blue,
        fontWeight: 'bold',
      },
      actions: {
        color: colors.blue,
      },
    },
    MuiSvgIcon: {
      fontSizeSmall: {
        fontSize: 14,
      },
    },
  },

  // Custom
  borderRadius: borderRadius,
});
