import React, { useEffect, useState } from 'react';
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
import { useLocation } from 'wouter';
import useCareRequestStore from '../../../store/careRequests';

const RequestsDashboard = () => {
  const style = useStyles();
  const {
    sort,
    setSort,
    limit,
    setLimit,
    page,
    setPage,
    columns,
    resetGrid,
    searchVal,
    searching,
    stateRefresher,
    requests,
    requestCount,
    statusType,
    setSearchVal,
    isNavigating,
    setNavigating,
    setSearching,
    loadingRequests = true,
    searchHandler,
    loadAgencyRequestData,
    setDefaultStatus,
    setStatusType,
  } = useAgencyRequestStore();

  const { id } = JSON.parse(localStorage.getItem('CURRENT_USER'));
  const [setIndex] = useCareRequestStore((state) => [state.setDetailIndex]);
  const [, setLocation] = useLocation();

  const type = 'requests';
  const url = `carerequest/${id}`;

  function handleChangeRowsPerPage(event) {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  }

  const nav = type !== statusType && limit > 10;

  useEffect(() => {
    setIndex(1);
    setNavigating(false);

    if (type !== statusType && limit < 25) {
      setDefaultStatus();
    }

    if (searching && type === statusType && !isNavigating) {
      searchHandler(searchVal, 'carerequestsearch', id, setLocation);
    } else {
      if (nav) {
        setLimit(10);
        setSearchVal('');
        setSearching(false);
        setDefaultStatus();
        setStatusType(type);
      } else {
        setSearchVal('');
        setSearching(false);
        loadAgencyRequestData(url, type);
      }
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
        <GridTitle title="Care Requests" />
        <Box sx={{ height: '50vh', width: '100%' }}>
          <LoadingBox loading={loadingRequests}>
            <TableContainer className={style.tableContainer}>
              <Box
                className={style.tableFlexContainer}
                sx={{ border: '1px solid #EAECF0' }}
              >
                <GridSearch url={url} type={type} />
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
requests = {requests};
columns = {columns};
loadingRequest = {loadingRequests};
                handleChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableContainer>
          </LoadingBox>
        </Box>
      </Box>
    </DrawerPage>
  );
};

export default RequestsDashboard;
