import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Link,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useLocation } from 'wouter';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import useStore from '../../store';
import ConfirmMatchModalInsert from './ConfirmMatchModalInsert';
import HtmlTooltip from '../app/HtmlTooltip';
import ax from '../../lib/api';
import useCareRequestStore from '../../store/careRequests';
import { formatFrequency } from '../../lib/dates';
import FlexBox from '../layout/FlexBox';
import ConfirmDialog from './ConfirmDialog';

const useStyles = makeStyles((theme) => ({
  errorButton: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
  icon: {
    color: theme.palette.primary.main,
  },
}));

const undoOptions = [
  {
    title: 'Delete',
    value: 'delete',
  },
  {
    title: 'Reopen',
    value: 'reopen',
  },
  {
    title: 'Reassign',
    value: 'reassign',
  },
];

const AgencyServicesTable = ({ request }) => {
  const classes = useStyles();
  const theme = useTheme();
  const openModal = useStore((state) => state.openModal);
  const closeModal = useStore((state) => state.closeModal);
  const [, setLocation] = useLocation();
  const [
    reloadDetailRequest,
    serviceRequestDelete,
    serviceRequestReopen,
    getProviderList,
    setUndoLoading,
    serviceReassign,
  ] = useCareRequestStore((state) => [
    state.reloadDetailRequest,
    state.serviceRequestDelete,
    state.serviceRequestReopen,
    state.getProviderList,
    state.setUndoLoading,
    state.serviceReassign,
  ]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const interest = request?.interests?.length ? true : false;

  async function handleMatchConfirm(provider_id, service_ids) {
    try {
      await ax.post(`/api/providers/${provider_id}/match-services/`, {
        services: service_ids,
      });
      closeModal();
      reloadDetailRequest();
    } catch (err) {
      alert(
        'There was an error matching that service. Please wait and try again.'
      );
    }
  }

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  const getErrorMessage = (reason) => {
    switch (reason) {
      case 'delete':
        return 'Deleting';
      case 'reopen':
        return 'Reopening';
      case 'reassign_confirm':
        return 'Reassigning';
    }
  };

  const reloadDetails = async () => {
    try {
      await reloadDetailRequest(false);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setLocation('/');
      }
    }
  };

  const handleUndo = async (reason, message, service, selectedProvider) => {
    try {
      setUndoLoading(true);
      switch (reason) {
        case 'delete':
          await serviceRequestDelete(request.id, service.id);
          break;
        case 'reopen':
          await serviceRequestReopen(request.id, service.id, {
            provider_id: service.match,
          });
          break;
        case 'reassign':
          await getProviderList(request.id, service.id);
          break;
        case 'reassign_confirm':
          await serviceReassign(request.id, service.id, {
            provider_id: selectedProvider,
          });
          break;
      }
      await reloadDetails();
      closeModal();
      setSelectedItem(null);
    } catch (e) {
      alert(
        `There was an error ${getErrorMessage(
          reason
        )} request. Please try again.!`
      );
    } finally {
      setUndoLoading(false);
    }
  };

  const undoClick = (service, provider) => {
    setSelectedItem({ provider, service });
    openModal(
      <ConfirmDialog
        confirm={handleUndo}
        title="Confirm Match Undo"
        description="Are you sure you want to undo this match?"
        confirmText="Undo"
        showQuestion
        questionText="Course of action?"
        reasons={undoOptions}
        service={service}
        requestId={request.id}
        provider={provider}
        triggerCancel={() => setSelectedItem(null)}
        isUndo
      />
    );
  };

  const downloadFile = async (response, request) => {
    const data = response.data;
    const blob = new Blob([data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    const userProfile = request?.care_manager?.userprofile;
    const cmName = userProfile?.first_name + ' ' + userProfile?.last_name;
    const filename = `DuettResults_${cmName}_${request?.id}`;
    link.download = `${filename}.pdf`;
    link.click();
  };

  const handleDownloadRequest = async (request) => {
    try {
      const response = await ax.get(
        `/api/patients/request/${request?.id}/download-data/`
      );
      downloadFile(response, request);
    } catch (err) {
      alert('There was an error downloading this request details');
    }
  };

  return (
    <TableContainer className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Provider</TableCell>
            <TableCell>Funding Source</TableCell>
            <TableCell>Service(s)</TableCell>
            <TableCell align="right">Hours</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell align="right">
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="end"
              >
                <IconButton
                  disabled={!interest}
                  className={classes.icon}
                  onClick={() => {
                    handleDownloadRequest(request);
                  }}
                >
                  <GetAppIcon
                    style={{
                      marginRight: '10%',
                      fontSize: 30,
                      cursor: 'pointer',
                    }}
                  />
                </IconButton>
                <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
                  <HtmlTooltip
                    arrow
                    placement="top"
                    open={tooltipOpen}
                    disableHoverListener
                    onClose={toggleTooltip}
                    onOpen={toggleTooltip}
                    title={
                      <React.Fragment>
                        <Typography
                          variant="body2"
                          color="primary"
                          gutterBottom
                        >
                          Click Match to Match a single Service to a Provider
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          disableElevation
                          style={{ marginBottom: theme.spacing(2) }}
                        >
                          Match
                        </Button>
                        <Typography
                          variant="body2"
                          color="primary"
                          gutterBottom
                        >
                          Click Match Multiple to Match all Services available
                          to a Provider
                        </Typography>
                        <Button
                          variant="contained"
                          color="secondary"
                          disableElevation
                        >
                          Match Multiple
                        </Button>
                      </React.Fragment>
                    }
                  >
                    <ErrorOutlineIcon onClick={toggleTooltip} />
                  </HtmlTooltip>
                </ClickAwayListener>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {request?.interests?.map((provider) =>
            provider.services?.map((service, index) => (
              <TableRow key={`Provider_${provider.account.id}_${service.id}`}>
                <TableCell component="th" scope="row">
                  {index === 0 ? <Link>{provider.account.name}</Link> : null}
                </TableCell>
                <TableCell>{service.funding_source}</TableCell>
                <TableCell>{service.service}</TableCell>
                <TableCell align="right">
                  {service.hours} hrs/{formatFrequency(service.frequency)}
                </TableCell>
                <TableCell>
                  <Link href={`mailto:${provider.email}`}>
                    {provider.email}
                  </Link>
                </TableCell>
                <TableCell>
                  <FlexBox justifyContent="space-between">
                    <FlexBox mr={2}>{provider.phone}</FlexBox>
                  </FlexBox>
                </TableCell>
                <TableCell align="right">
                  {!service.match ? (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{
                          marginRight:
                            provider.services.length > 1 && index === 0
                              ? theme.spacing(1)
                              : '136px',
                        }}
                        disableElevation
                        onClick={() =>
                          openModal(
                            <ConfirmMatchModalInsert
                              services={[service]}
                              confirm={() =>
                                handleMatchConfirm(provider.account.id, [
                                  service.id,
                                ])
                              }
                            />
                          )
                        }
                      >
                        Match
                      </Button>

                      {provider.services.length > 1 && index === 0 ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          disableElevation
                          onClick={() =>
                            openModal(
                              <ConfirmMatchModalInsert
                                services={provider.services}
                                confirm={() =>
                                  handleMatchConfirm(
                                    provider.account.id,
                                    provider.services.map((s) => s.id)
                                  )
                                }
                              />
                            )
                          }
                        >
                          Match Multiple
                        </Button>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {provider.account.id === service.match ? (
                        <FlexBox alignItems="center">
                          <Typography variant="body2">Matched</Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            style={{
                              marginLeft: 30,
                            }}
                            disabled={
                              service.id === selectedItem?.service?.id &&
                              provider.account.id ===
                                selectedItem?.provider?.account?.id
                            }
                            disableElevation
                            onClick={() => undoClick(service, provider)}
                          >
                            Undo
                          </Button>
                        </FlexBox>
                      ) : null}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
          {request?.interests < 1 ? (
            <TableRow>
              <TableCell colSpan="7">No Interests</TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

AgencyServicesTable.defaultProps = {};

AgencyServicesTable.propTypes = {};

export default AgencyServicesTable;
