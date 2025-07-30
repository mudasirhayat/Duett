import React from 'react';

import { Box } from '@material-ui/core';
import SortField from './Sort/NewSortField';
import FundingFilter from './Filters/NewFundingFilter';
import ServiceFilter from './Filters/NewServiceFilter';
import StatusFilter from './Filters/NewStatusFilter';
import TextFilter from './Filters/NewFieldFilter';

const Header = ({ sortLabel, sort, setSort, url, type }) => {
  const allowedSortHeaders = [
    'patient__zip',
    'id',
    'refreshed_time',
    'full_name',
    'birthday',
    'posted',
    'matched',
  ];

  let component = null;

  switch (sortLabel) {
    case 'funding':
      component = <FundingFilter field={sortLabel} type={type} url={url} />;
      break;
    case 'services':
      component = <ServiceFilter field={sortLabel} type={type} url={url} />;
      break;
    case 'status':
      component = <StatusFilter field={sortLabel} type={type} url={url} />;
      break;
    case 'caseManager':
      component = <TextFilter field={sortLabel} type={type} url={url} />;
      break;
    default:
      break;
  }

  return (
    <>
      {allowedSortHeaders.includes(sortLabel) && (
        <SortField sortLabel={sortLabel} sort={sort} setSort={setSort} />
      )}
      <Box sx={{ position: 'relative' }}>{component}</Box>
    </>
  );
};

export default Header;
