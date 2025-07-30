import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';

import useCareRequestStore from '../../store/careRequests';
import LoadingBox from '../../components/layout/LoadingBox';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: 18,
    letterSpacing: 0.5,
  },
  row: {
    border: 'none',
  },
  cell: {
    border: 'none',
    fontSize: 12,
    color: '#404040',
  },
  pagination: {
    border: 'none',
    borderTop: '1px solid #C7D6DB',
    paddingLeft: 0,
  },
  heading: {
    border: 'none',
    borderBottom: '1px solid #C7D6DB',
  },
  table: {
    borderTop: 'none',
  },
  headingText: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    lineHeight: '16px',
    color: '#000000',
  },
  cellSmall: {
    width: 90,
  },
  paginationTableCell: {
    padding: '0px !important',
    border: 0,
    display: 'table-cell',
  },
  noHistory: {
    fontSize: 20,
    textAlign: 'center',
    padding: 60,
  },
}));
const History = ({ request }) => {
  const classes = useStyles();
  const [
    requestHistory,
    getRequestActivity,
    historyLoading,
  ] = useCareRequestStore((state) => [
    state.requestHistory,
    state.getRequestActivity,
    state.historyLoading,
  ]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (request?.id) {
      getRequestActivity(request.id);
    }
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getData = () => {
    return requestHistory.slice(page * limit, (page + 1) * limit);
  };

  return (
    <LoadingBox loading={historyLoading}>
      <div>
        <Typography variant="h5" className={classes.title}>
          Care Request History
        </Typography>
        {getData().length ? (
          <TableContainer>
            <Table className={classes.table}>
              <TableHead>
                <TableRow className={classes.heading}>
                  <TableCell className={classes.headingText}>Date</TableCell>
                  <TableCell className={classes.headingText}>Time</TableCell>
                  <TableCell className={classes.headingText}>
                    Activity
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getData().map((history, index) => (
                  <TableRow className={classes.row} key={index}>
                    <TableCell
                      className={clsx(classes.cell, classes.cellSmall)}
                    >
                      {history.activity_date}
                    </TableCell>
                    <TableCell
                      className={clsx(classes.cell, classes.cellSmall)}
                    >
                      {history.activity_time}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {history.message}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className={classes.pagination}>
                  <TablePagination
                    className={classes.paginationTableCell}
                    colSpan={7}
                    rowsPerPageOptions={[10, 25]}
                    count={requestHistory.length}
                    page={page}
                    rowsPerPage={10}
                    limit={limit}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    onPageChange={(_event, page) => setPage(page)}
                  />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className={classes.noHistory}>No history to show</div>
        )}
      </div>
    </LoadingBox>
  );
};

export default History;
