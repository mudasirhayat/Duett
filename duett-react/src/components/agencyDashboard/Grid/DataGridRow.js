import React, { useState } from 'react';
import { Box, TableRow } from '@material-ui/core';
import FlexBox from '../../layout/FlexBox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { timeAge } from '../../../lib/dates';
import { dataFormatter, getFrequency } from '../../../lib/helpers';
import { Cell, useStyles } from '../useStyles';
import ActiveStatuses from './Statuses';
import { useLocation } from 'wouter';
import ClipboardListIcon from '../../icons/ClipboardListIcon';
import useAgencyRequestStore from '../../../store/agencyRequest';

const headers = ({
  index,
  request,
  style,
  setLocation,
  columns,
  setRow,
  open,
  setOpen,
  setSearchVal,
  resetFilters,
}) => {
  return request?.services?.map((service, i) => {
    return (
      <TableRow
        key={`RequestedService_${service.id}`}
        style={{
          display: i === 0 || (open && i > 0) ? 'table-row' : 'none',
        }}
      >
        {columns?.map((column, j) => {
          let component = '';

          switch (column?.headerName) {
            case 'ID':
              component = (
                <Cell key={j}>
                  {index === -1 && (
                    <FlexBox alignItems="center">
                      <div
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                        onClick={() => {
                          setLocation(`/request/${request?.id}`);
                        }}
                      >
                        {i === 0 && request?.id}
                      </div>
                    </FlexBox>
                  )}
                </Cell>
              );
              break;
            case 'Client Name':
              component = (
<Cell key={j} style={{ minWidth: '140px', maxWidth: '140px' }}>
  {index === -1 && (
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
                      {i === 0 && request?.patient?.name}
                    </div>
                  )}
                </Cell>
              );
              break;
            case 'Case Manager':
              component = (
                <Cell key={j} style={{ minWidth: '130px', maxWidth: '130px' }}>
                  {i === 0 && request?.care_manager?.userprofile?.name}
                </Cell>
              );
              break;
            case 'Zip Code':
              component = (
                <Cell key={j}>
                  <FlexBox alignItems="center" justifyContent="space-between">
                    {i === 0 && request?.patient?.zip}
                  </FlexBox>
                </Cell>
              );
              break;
            case 'Services':
              component = (
                <Cell style={{ minWidth: '140px', maxWidth: '140px' }} key={j}>
                  {service?.service}
                </Cell>
              );
              break;
            case 'Funding':
              component = (
                <Cell style={{ minWidth: '140px', maxWidth: '140px' }} key={j}>
                  {service?.funding_source}
                </Cell>
              );
              break;
            case 'Hours':
              component = (
                <Cell style={{ minWidth: '90px' }} key={j}>
                  {service?.hours}
                  {getFrequency(service?.frequency)}
                </Cell>
              );
              break;
            case 'Matched':
              component = (
                <Cell key={j} style={{ minWidth: '100px', maxWidth: '100px' }}>
                  {service?.match_date
                    ? dataFormatter(service?.match_date)
                    : ''}
                </Cell>
              );
              break;
            case 'Posted':
              component = (
                <Cell
                  key={j}
                  style={{
                    minWidth: '130px',
                    maxWidth: '130px',
                  }}
                >
                  <FlexBox alignItems="center">
                    <Box sx={{ minWidth: '95px', maxWidth: '95px' }}>
                      {index === -1 && dataFormatter(request?.refreshed_time)}
                    </Box>
                    {request?.services?.length > 1 && index === -1 ? (
                      <>
                        {i === 0 && (
                          <Box
                            onClick={() => {
                              setOpen(!open);
                            }}
                            size="small"
                            className={style.IconButtonCaret}
                          >
                            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </Box>
                        )}
                      </>
                    ) : null}
                  </FlexBox>
                </Cell>
              );
              break;
            case 'Time Since Posted':
              component = (
                <Cell key={j}>
                  {i === 0 && (
                    <FlexBox alignItems="center">
                      <Box sx={{ minWidth: '80px', maxWidth: '80px' }}>
                        {index === -1 &&
                          timeAge(request?.refreshed_time)?.replace(
                            /\s*old\s*/,
                            ''
                          )}
                      </Box>
                      {request?.services?.length > 1 && index === -1 ? (
                        <>
                          {i === 0 && (
                            <Box
                              onClick={() => {
                                setOpen(!open);
                              }}
                              size="small"
                              className={style.IconButtonCaret}
                            >
                              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </Box>
                          )}
                        </>
                      ) : null}
                    </FlexBox>
                  )}
                </Cell>
              );
              break;

            case 'Status':
              component = (
                <Cell key={j} style={{ minWidth: '120px', maxWidth: '120px' }}>
                  {index === -1 && i === 0 && (
                    <ActiveStatuses status={request?.status} />
                  )}
                </Cell>
              );
              break;
            case 'Actions':
              component = (
                <Cell key={j} style={{ paddingRight: '32px' }}>
                  {index === -1 && (
                    <FlexBox alignItems="center">
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setLocation(`/request/${request?.id}`);
                        }}
                      >
                        <ClipboardListIcon />
                      </div>
                    </FlexBox>
                  )}
                </Cell>
              );
              break;
            default:
              break;
          }

          return component;
        })}
      </TableRow>
    );
  });
};

const DataGridRequestRow = ({ index = -1, request, columns, setRow }) => {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { setSearchVal, resetFilters } = useAgencyRequestStore();

  const style = useStyles();

  return headers({
    index,
    request,
    columns,
    setRow,
    open,
    style,
    setLocation,
    setOpen,
    setSearchVal,
    resetFilters,
  });
};

export default DataGridRequestRow;
