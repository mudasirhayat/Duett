import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import DataGridRequestRow from './DataGridRow';
import DataGridRequestColumn from './DataGridColumn';
import { useStyles } from '../useStyles';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import LoadingBox from '../../layout/LoadingBox';
import ClientDataGridRequestRow from './ClientGridRow';
import Error from '../Error';
import useAgencyRequestStore from '../../../store/agencyRequest';

const DataGrid = ({
  url,
  type,
  sort,
  setSort,
  page,
  setPage,
  limit,
  requestCount,
  requests,
  columns,
  loadingRequests,
  handleChangeRowsPerPage,
}) => {
  const style = useStyles();
  const Row =
    type !== 'clients' ? DataGridRequestRow : ClientDataGridRequestRow;
  const { error } = useAgencyRequestStore();

  return (
    <LoadingBox loading={loadingRequests}>
      <TableContainer className={style.unset}>
        <Table>
          <TableHead>
            <TableRow className={style.row}>
              {columns?.map((column) => (
                <DataGridRequestColumn
                  key={column.id}
                  column={column}
                  data={requests}
                  proxyData={requests}
                  sort={sort}
                  setSort={setSort}
                  type={type}
                  url={url}
                />
              ))}
            </TableRow>
          </TableHead>

          {error ? (
            <Error error={error} />
          ) : (
            <TableBody>
              {requests?.map((row, index) => (
                <Row key={index} request={row} columns={columns} />
              ))}
              <TableRow
                className={style.paginationTableRow}
                sx={{ borderBottom: '1px solid #C7D6DB' }}
              >
                <TablePagination
                  className={style.paginationTableCell}
                  colSpan={7}
                  rowsPerPageOptions={[10, 25]}
                  count={requestCount}
                  rowsPerPage={limit}
                  page={page}
                  onPageChange={(_event, page) => setPage(page)}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
              <td
                colSpan={12}
                style={{
                  height: requests?.length < 5 ? '300px' : '0px',
                  backgroundColor: '#fafafa',
                }}
              />
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </LoadingBox>
  );
};

export default DataGrid;
