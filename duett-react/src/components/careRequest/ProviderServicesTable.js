import React from 'react';
import {
  Typography,
  Button,
  Link,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import useStore from '../../store';
import CloseIcon from '@material-ui/icons/Close';
import NotifyRequestModalInsert from './NotifyRequestModalInsert';
import CancelRequestModalInsert from './CancelRequestModalInsert';
import { formatFrequency } from '../../lib/dates';
import ax from '../../lib/api';
import useCareRequestStore from '../../store/careRequests';

const useStyles = makeStyles((theme) => ({
  errorButton: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
}));

const ProviderServicesTable = ({ request, loadPatientRequest }) => {
  const classes = useStyles();
  const openModal = useStore((state) => state.openModal);
  const closeModal = useStore((state) => state.closeModal);
  const reloadDetailRequest = useCareRequestStore(
    (state) => state.reloadDetailRequest
  );

  async function handleConfirmNotify(ids) {
    try {
      await ax.post('/api/services-requested/create-interests/', {
        services: ids,
      });
    } catch (error) {
      let errorMessage =
        'There was an error showing interest. Please wait and try again.';
      if (
        error.response &&
        error.response.status !== 500 &&
        error.response.data
      ) {
        errorMessage = error.response.data;
      }
      alert(errorMessage);
    } finally {
      closeModal();
      loadPatientRequest(true);
    }
  }

  async function handleCancelNotify(id) {
    try {
      await ax.post(`/api/services-requested/${id}/cancel-interest/`);
      closeModal();
      reloadDetailRequest();
    } catch (e) {
      alert(
        'There was an error canceling interest. Please wait and try again.'
      );
    }
  }

  return (
    <TableContainer className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Care Manager</TableCell>
            <TableCell>Funding Source</TableCell>
            <TableCell>Service(s)</TableCell>
            <TableCell>Hours</TableCell>
            <TableCell align="right">
              {request?.status !== 'Closed' ? (
                <Button
                  variant="contained"
                  color="secondary"
                  disableElevation
                  onClick={() =>
                    openModal(
                      <NotifyRequestModalInsert
                        services={request.services}
                        confirm={() =>
                          handleConfirmNotify(request.services.map((s) => s.id))
                        }
                      />
                    )
                  }
                >
                  Notify All
                </Button>
              ) : null}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {request?.services?.map((service) => (
            <TableRow key={`ProviderService_${service.id}`}>
              <TableCell component="th" scope="row">
                <Link>{`${request.care_manager.userprofile.first_name} ${request.care_manager.userprofile.last_name}`}</Link>
              </TableCell>
              <TableCell>{service.funding_source}</TableCell>
              <TableCell>{service.service}</TableCell>
              <TableCell>
                {service.hours} hrs/{formatFrequency(service.frequency)}
              </TableCell>
              <TableCell align="right">
                {service.matched && (
                  <Typography variant="body2">Matched</Typography>
                )}
                {service.interested && !service.matched ? (
                  <Button
                    variant="contained"
                    disableElevation
                    className={classes.errorButton}
                    onClick={() =>
                      openModal(
                        <CancelRequestModalInsert
                          confirm={() => handleCancelNotify(service.id)}
                        />
                      )
                    }
                  >
                    <CloseIcon fontSize="small" />
                    Cancel
                  </Button>
                ) : null}
                {!service.interested && !service.matched ? (
                  <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={() =>
                      openModal(
                        <NotifyRequestModalInsert
                          services={[service]}
                          confirm={() => handleConfirmNotify([service.id])}
                        />
                      )
                    }
                  >
                    Notify
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ProviderServicesTable.defaultProps = {};

ProviderServicesTable.propTypes = {};

export default ProviderServicesTable;
