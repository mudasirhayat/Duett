import React, { memo } from 'react';
import { Box, TableCell, Typography } from '@material-ui/core';
import { useStyles } from '../useStyles';
import Header from '../NewHeader';

const DataGridRequestColumn = memo(
  ({ column: { headerName, field }, sort, setSort, url, type }) => {
    const style = useStyles();
    const isTimePosted = headerName === 'Time Since Posted';

    function DataGridColumnLabel() {
      return (
        <Typography
          variant="subtitle1"
          variantMapping={{
            subtitle1: 'div',
          }}
        >
          <Box className={style.columnLabel}>
            <Box
              className={`${style.headerName} ${
                isTimePosted ? style.timePosted : ''
              }`}
            >
              {headerName}
            </Box>
            <Header
              sortLabel={field}
              sort={sort}
              setSort={setSort}
              type={type}
              url={url}
            />
          </Box>
        </Typography>
      );
    }

    return (
      <TableCell className={style.tableHead}>
        <DataGridColumnLabel />
      </TableCell>
    );
  }
);

export default DataGridRequestColumn;
