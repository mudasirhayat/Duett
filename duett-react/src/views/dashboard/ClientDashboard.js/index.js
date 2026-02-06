import React, { useEffect, useState } from 'react';
import NewAgencyRequestButton from '../../../components/agencyDashboard/NewRequestButton';
import DataGrid from '../../../components/agencyDashboard/Grid/DataGrid';
import GridTitle from '../../../components/agencyDashboard/Grid/GridTitle';
import useAgencyRequestStore from '../../../store/agencyRequest';
import LoadingBox from '../../../components/layout/LoadingBox';
import DrawerPage from '../../../components/app/DrawerPage';
import {
  Box,
  TableContainer,
} from '@material-ui/core';
import {
  useStyles,
} from '../useStyles';
import NewGridReset from '../../../components/agencyDashboard/Grid/NewGridReset';
import GridSearch from '../../../components/agencyDashboard/Grid/NewGridSearch';
import { useLocation } from 'wouter';
import useCareRequestStore from '../../../store/careRequests';

const ClientDashboard = () => {
  const style = useStyles();
  const {
    sort,
    setSort,
    limit,
    setLimit,
    searchVal,
    searching,
    page,
    setPage,
    resetGrid,
    clients,
    stateRefresher,
    clientColumns,
    clientCount,
    loadingRequests,
    searchHandler,
    setSearchVal,
    statusType,
    isNavigating,
    setNavigating,
    setSearching,
    loadAgencyRequestData,
  } = useAgencyRequestStore();
  const { id } = JSON.parse(localStorage.getItem('CURRENT_USER'));
  const [index, setIndex] = useCareRequestStore((state) => [
    state.detailIndex,
    state.setDetailIndex,
  ]);
  const [, setLocation] = useLocation();

  const type = 'clients';
  const url = `client/${id}`;

  function handleChangeRowsPerPage(event) {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  }

  useEffect(() => {
    setIndex(1);
    setNavigating(false);
    if (searching && type === statusType && !isNavigating) {
      searchHandler(searchVal, 'clientsearch', id, setLocation);
    } else {
      setSearchVal('');
      setSearching(false);
      loadAgencyRequestData(url, type);
    }
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
        <GridTitle title="Clients" />
        <Box sx={{ height: '50vh', width: '100%' }}>
          <LoadingBox loading={loadingRequests}>
            <TableContainer className={style.tableContainer}>
              <Box className={style.tableFlexContainer}>
                <GridSearch url={url} type={type} />
                <NewGridReset resetGrid={resetGrid} url={url} type={type} />
              </Box>
              <DataGrid
                type={type}
                sort={sort}
                setSort={setSort}
                page={page}
                setPage={setPage}
                limit={limit}
                requestCount={clientCount}
                requests={clients}
                columns={clientColumns}
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

export default ClientDashboard;
