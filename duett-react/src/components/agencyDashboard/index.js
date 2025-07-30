import React, { useEffect } from 'react';
import { Box, CircularProgress, TableContainer } from '@material-ui/core';

import { useStyles } from './useStyles';
import shallow from 'zustand/shallow';
import useFilterSortStore from '../../store/utility';
import NewAgencyRequestButton from './NewRequestButton';
import GridTitle from './Grid/GridTitle';
import LoadingBox from '../layout/LoadingBox';
import GridSearchBar from './Grid/GridSearchBar';
import GridRequestReset from './Grid/GridRequestReset';
import DataGrid from './Grid/DataGrid';
import useCareRequestStore from '../../store/careRequests';
import useAgencyRequestStore from '../../store/agencyRequest';

const AgencyDashboard = ({
  // searchType,
  // requestType,
  // rowType = '',
  // id = null,
  // setRequest,
  // setProxyData,
  title,
  name = '',
  rows,
  data,
  hideSearch = false,
}) => {
  const style = useStyles({ hideSearch });
  // const [gridLoader, loadRequestData, searchError] = useFilterSortStore(
  //   (state) => [state.gridLoader, state.loadRequestData, state.searchError],
  //   shallow
  // );
  const [setDetailIndex] = useCareRequestStore(
    (state) => [state.setDetailIndex],
    shallow
  );

  const {
    setPage,
    setLimit,
    requestCount,
    requests,
    page,
    limit,
    columns,
    loadingRequests,
    loadAgencyRequestData,
  } = useAgencyRequestStore();

  useEffect(() => {
    loadAgencyRequestData();
  }, [loadAgencyRequestData, page, limit]);

  return (
    <Box sx={{ width: '100%', paddingX: '25px' }}>
      <NewAgencyRequestButton />
      <GridTitle title={title} name={name} />
      <Box sx={{ height: '50vh', width: '100%' }}>
        <LoadingBox loading={loadingRequests}>
          <TableContainer className={style.tableContainer}>
            {/* <Box className={style.tableFlexContainer}>
              <GridSearchBar
                searchType={searchType}
                data={data}
                setProxyData={setProxyData}
                hideSearch={hideSearch}
              />
              <GridRequestReset
                data={data}
                setProxyData={setProxyData}
                hideSearch={hideSearch}
              />
            </Box> */}
            <DataGrid
              data={data}
              requests={rows}
              columns={columns}
              // rowType={rowType}
              // setProxyData={setProxyData}
            />
            {/* {gridLoader || searchError ? (
              <div className={style.loader}>
                {gridLoader && <CircularProgress />}
                {searchError && (
                  <div className={style.searchError}>{searchError}</div>
                )}
              </div>
            ) : (

            )} */}
          </TableContainer>
        </LoadingBox>
      </Box>
    </Box>
  );
};

export default AgencyDashboard;
