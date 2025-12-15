import React, { useState } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FlexBox from '../layout/FlexBox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useLocation } from 'wouter';
import { formatFrequency, hoursSinceNow, timeAge } from '../../lib/dates';
import Timestamp from '../careRequest/Timestamp';
import useCareRequestStore from '../../store/careRequests';

const useStyles = makeStyles(() => ({
  expirationCell: {
    backgroundColor: '#f2f2f2',
  },
  link: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const CareRequestRow = ({ request, index, columns }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const clearDetailRequest = useCareRequestStore(
    (state) => state.clearDetailRequest
  );
  function openRequest() {
    clearDetailRequest();
    setLocation(`/request/${request.id}`);
  }

  function formatId(id) {
    let fullId = id.toString();

    while (fullId.length < 6) {
      fullId = `0${fullId}`;
    }

    return fullId;
  }

  return (
    <>
      {request.services.map((service, i) => {
        return (
          <TableRow
            key={`RequestedService_${service.id}`}
            style={{
              display: i === 0 || (open && i > 0) ? 'table-row' : 'none',
            }}
          >
            {columns.map((column, j) => {
              let component = '';
              if (j === 0) {
                component = (
                  <TableCell key={j}>
                    {i === 0 ? (
                      <Typography
                        className={classes.link}
                        variant="body2"
                        color="primary"
                        onClick={openRequest}
                      >
                        {formatId(request.id)}
                      </Typography>
                    ) : null}
                  </TableCell>
                );
              } else {
                switch (column.name) {
                  case 'Patient Name':
                  case 'Care Manager Name':
                    const { first_name = '', last_name = '' } =
                      column.name === 'Patient Name'
                        ? request.patient || {}
                        : request.care_manager?.userprofile || {};
                    component = (
                      <TableCell key={j} component="th" scope="row">
                        {i === 0 ? <>{`${first_name} ${last_name}`}</> : null}
                      </TableCell>
                    );
                    break;
                  case 'Zip Code':
                    component = (
                      <TableCell key={j}>
                        <FlexBox
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          {i === 0 && request.patient.zip}
                        </FlexBox>
                      </TableCell>
                    );
                    break;
                  case 'Service(s)':
                    component = (
                      <TableCell key={j}>{service.service}</TableCell>
                    );
                    break;
                  case 'Funding Source':
                    component = (
                      <TableCell key={j}>{service.funding_source}</TableCell>
                    );
                    break;
                  case 'Hours':
                    component = (
                      <TableCell key={j}>
                        {service.hours} hrs/{formatFrequency(service.frequency)}
                      </TableCell>
                    );
                    break;
                  case 'Time Since Posted':
                    component = (
                      <TableCell key={j} className={classes.expirationCell}>
                        <FlexBox
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Timestamp
                            expired={
                              hoursSinceNow(request?.refreshed_time) > 48
                            }
                            warning={
                              hoursSinceNow(request?.refreshed_time) > 24
                            }
                          >
                            {timeAge(request?.refreshed_time)}{' '}
                          </Timestamp>
                          {i === 0 && request.services.length > 1 ? (
                            <>
                              <IconButton
                                onClick={() => setOpen(!open)}
                                size="small"
                              >
                                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </IconButton>
                            </>
                          ) : null}
                        </FlexBox>
                      </TableCell>
                    );
                    break;
                  case 'Organization Name':
                    component = (
                      <TableCell key={j}>
                        {i === 0 && request.agency_name}
                      </TableCell>
                    );
                    break;
                  case 'Status':
                  case 'Request Status':
                    component = (
                      <TableCell key={j}>{i === 0 && request.status}</TableCell>
                    );
                    break;
                  default:
                    break;
                }
              }
              return component;
            })}
          </TableRow>
        );
      })}
    </>
  );
};

CareRequestRow.propTypes = {
  request: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default CareRequestRow;
