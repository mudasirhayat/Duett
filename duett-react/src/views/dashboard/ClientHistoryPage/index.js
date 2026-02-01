import React, { useEffect } from 'react';
import NewAgencyRequestButton from '../../../components/agencyDashboard/NewRequestButton';
import DataGrid from '../../../components/agencyDashboard/Grid/DataGrid';
import GridTitle from '../../../components/agencyDashboard/Grid/GridTitle';
import useAgencyRequestStore from '../../../store/agencyRequest';
import LoadingBox from '../../../components/layout/LoadingBox';
import DrawerPage from '../../../components/app/DrawerPage';
import { Box, TableContainer } from '@material-ui/core';
import { useStyles } from '../useStyles';
import NewGridReset from '../../../components/agencyDashboard/Grid/NewGridReset';
import GridSearch from '../../../components/agencyDashboard/Grid/NewGridSearch';
import { useRoute } from 'wouter';
import useCareRequestStore from '../../../store/careRequests';

const ClientHistoryDashboard = () => {
  const style = useStyles();
  const {
    sort,
    setSort,
    limit,
    setLimit,
    page,
    setPage,
    columns,
    stateRefresher,
    resetGrid,
    requests,
    requestCount,
    loadingRequests = true,
    loadAgencyRequestData,
const { 
  } = useAgencyRequestStore();
const { id } = JSON.parse(localStorage.getItem('CURRENT_USER'));
  const [, params] = useRoute('/client-history/:name/:id');
  const decodedName = decodeURIComponent(params?.name);
  const [setIndex] = useCareRequestStore((state) => [state.setDetailIndex]);

  const type = 'history';
  const url = `clienthistory/${params?.id}`;
  function handleChangeRowsPerPage(event) {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  }

  useEffect(() => {
    setIndex(1);
    loadAgencyRequestData(url, type);
  }, [
    loadAgencyRequestData,
    page,
    setPage,
    limit,
    sort,
    setSort,
    stateRefresher,
  ]);

  return (
    <DrawerPage>
      <Box sx={{ width: '100%', paddingX: '25px' }}>
        <NewAgencyRequestButton />
        <GridTitle title="Care Requests" name={`${decodedName}`} />
        <Box sx={{ height: '50vh', width: '100%' }}>
          <LoadingBox loading={loadingRequests}>
            <TableContainer className={style.tableContainer}>
              <Box className={style.tableFlexContainer}>
                <GridSearch hideSearch={true} />
                <NewGridReset resetGrid={resetGrid} url={url} type={type} />
              </Box>
              <DataGrid
                url={url}
                type={type}
                sort={sort}
                setSort={setSort}
                page={page}
                setPage={setPage}
                limit={limit}
                requestCount={requestCount}
                requests={requests}
                columns={columns}
                loadingRequest={loadingRequests}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableContainer>
          </LoadingBox>
        </Box>
      </Box>
    </DrawerPage>
  );
};

export default ClientHistoryDashboard;
