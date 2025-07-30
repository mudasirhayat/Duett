import { Tooltip, withStyles } from '@material-ui/core';

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    boxShadow: `3px 5px 17px -3px ${theme.palette.light.main}`,
    borderRadius: 0,
    padding: theme.spacing(2),
  },
  arrow: {
    color: 'white',
  },
}))(Tooltip);

export default HtmlTooltip;
