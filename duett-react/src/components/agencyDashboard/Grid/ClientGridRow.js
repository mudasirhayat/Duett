import React from 'react';
import FlexBox from '../../layout/FlexBox';
import { Cell } from '../useStyles';
import { dataFormatter } from '../../../lib/helpers';
import { useLocation } from 'wouter';
import ClipboardListIcon from '../../icons/ClipboardListIcon';
import { TableRow } from '@material-ui/core';
import useAgencyRequestStore from '../../../store/agencyRequest';

const headers = ({ request, columns, setSearchVal, resetFilters }) => {
  return columns?.map((column, j) => {
    let component = '';
    const [, setLocation] = useLocation();

    switch (column.headerName) {
      case 'Client Name':
        component = (
          <Cell key={j} style={{ minWidth: '170px', maxWidth: '170px' }}>
            <FlexBox alignItems="center" justifyContent="space-between">
              <div
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setSearchVal('');
                  resetFilters(true, 'history');
                  setLocation(
                    `/client-history/${request?.patient?.name}/${request?.patient?.id}/`
                  );
                }}
              >
                {request?.patient?.name}
              </div>
            </FlexBox>
          </Cell>
        );
        break;
      case 'Zip Code':
        component = (
          <Cell key={j}>
            <FlexBox alignItems="center" justifyContent="space-between">
              {request?.patient?.zip}
            </FlexBox>
          </Cell>
        );
        break;

      case 'Birth Date':
        component = (
          <Cell key={j}>{dataFormatter(request?.patient?.birth_date)}</Cell>
        );
        break;
      case 'Actions':
        component = (
          <Cell key={j}>
            <FlexBox alignItems="center">
              <div
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setSearchVal('');
                  resetFilters(true, 'history');
                  setLocation(
                    `/client-history/${request?.patient?.name}/${request?.patient?.id}/`
                  );
                }}
              >
                <ClipboardListIcon />
              </div>
            </FlexBox>
          </Cell>
        );
        break;
      default:
        break;
    }

    return component;
  });
};
const ClientDataGridRequestRow = ({ index, request, columns }) => {
  const { setSearchVal, resetFilters } = useAgencyRequestStore();

  return (
    <>
      <TableRow>
        {headers({
          index,
          request,
          columns,
          setSearchVal,
          resetFilters,
        })}
      </TableRow>
    </>
  );
};

export default ClientDataGridRequestRow;
