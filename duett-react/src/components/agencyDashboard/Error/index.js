import { Box, TableBody, TableCell, TableRow } from '@material-ui/core';
import { useStyles } from './useStyles';

const Error = ({ error = '' }) => {
  const style = useStyles();

  return (
    error && (
      <TableBody>
        <TableRow>
          <TableCell className={style.errorContainer} colSpan={12}>
            <Box className={style.error}>
              <Box className={style.text}>{error}</Box>
            </Box>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  );
};

export default Error;
