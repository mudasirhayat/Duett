import React, { memo } from 'react';
import SortHeader from './Sort/SortHeader';
import { Box } from '@material-ui/core';
import RequestStatusFilter from './Filters/RequestStatusFilter';
import FieldFilter from './Filters/FieldFilter';
import FieldServiceFilter from './Filters/FieldServiceFilter';
import FieldFundingFilter from './Filters/FieldFundingFitler';

const ColumnHeader = memo(({ field, data, proxyData, setProxyData }) => {
  const simpleSortFields = [
    'id',
    'zipCode',
    'posted',
    'lastRefreshed',
    'birthday',
    'matched',
    'clientName',
  ];

  let component = null;

  switch (field) {
    case 'status':
      component = (
        <RequestStatusFilter
          field={field}
          data={data}
          setProxyData={setProxyData}
        />
      );
      break;
    case 'caseManager':
      component = (
        <FieldFilter field={field} data={data} setProxyData={setProxyData} />
      );
      break;
    case 'funding':
      component = (
        <FieldFundingFilter
          field={field}
          data={data}
          setProxyData={setProxyData}
        />
      );
      break;
    case 'services':
      component = (
        <FieldServiceFilter
          field={field}
          data={data}
          setProxyData={setProxyData}
        />
      );
      break;
    default:
      break;
  }

  return (
    <>
      <SortHeader
        field={field}
        simpleSortOption={simpleSortFields.includes(field)}
        proxyData={proxyData}
        setProxyData={setProxyData}
      />
      <Box sx={{ position: 'relative' }}>{component}</Box>
    </>
  );
});

export default ColumnHeader;
