import React, { useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputLabel,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import FlexBox from '../../components/layout/FlexBox';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArchiveIcon from '@material-ui/icons/Archive';
import AgencyServicesTable from '../../components/careRequest/AgencyServicesTable';
import RequestDetailsTab from '../../components/careRequest/RequestDetailsTab';
import InlineDetail from '../../components/careRequest/InlineDetail';
import RequestStatusLabel from '../../components/careRequest/RequestStatusLabel';
import Timestamp from '../../components/careRequest/Timestamp';
import Tabs from '../../components/layout/Tabs';
import { accountTypes, useAccountType } from '../../hooks/useRole';
import { RoleMatch, RoleSwitch } from '../../components/app/RoleSwitch';
import LabelDivider from '../../components/app/LabelDivider';
import CareDetails from '../../components/careRequest/CareDetails';
import ProviderServicesTable from '../../components/careRequest/ProviderServicesTable';
import { useLocation, useRoute, Link } from 'wouter';
import useCareRequestStore from '../../store/careRequests';
import shallow from 'zustand/shallow';
import AntSwitch from '../../components/forms/AntSwitch';
import ax from '../../lib/api';
import { hoursSinceNow, timeAge } from '../../lib/dates';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import ConfirmDialog from '../../components/careRequest/ConfirmDialog';
import useStore from '../../store';
import LoadingBox from '../../components/layout/LoadingBox';
import useAuthStore from '../../store/auth';
import History from './History';
import ChangeAssigneeModal from '../../components/careRequest/ChangeAssigneeModal';
import DeleteErrorDialog from '../../components/careRequest/DeleteErrorDialog';
import useAgencyRequestStore from '../../store/agencyRequest';
import UserConfirmationDialog from '../../components/careRequest/UserConfirmationDialog';
const useStyles = makeStyles((theme) => ({
  sectionLabel: {
    marginBottom: theme.spacing(1),
    fontSize: 12,
  },
  label: {
    minWidth: 96,
    fontSize: 12,
  },
  statusBar: {
    borderLeft: `10px solid ${theme.palette.secondary.main}`,
    marginBottom: theme.spacing(1),
    position: 'relative',
  },
  providerStatusBar: {
    borderLeftColor: theme.palette.primary.main,
  },
  pagination: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    color: theme.palette.light.main,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  deleteButton: {
    color: theme.palette.error.main,
    '&:hover': {
      borderColor: theme.palette.error.main,
    },
  },
  organizationName: {
    marginRight: 10,
  },
}));
const RequestDetailPage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const accountType = useAccountType();
  const [, params] = useRoute('/request/:id');
  const [, setLocation] = useLocation();
  const openModal = useStore((state) => state.openModal);
  const closeModal = useStore((state) => state.closeModal);
  const account = useAuthStore((state) => state.user.account);
  const [
    count,
    requests,
    request,
    loadRequest,
    reloadRequest,
    index,
    clearRequest,
    setRequest,
    setIndex,
    loadRequests,
    setParams,
    loadingRequests,
    loadingDetail,
    page,
    setPage,
    totalPage,
    limit,
    getNotesRequest,
    updatesNotes,
  ] = useCareRequestStore(
    (state) => [
      state.requestsCount,
      state.requests,
      state.detailRequest,
      state.loadDetailRequest,
      state.reloadDetailRequest,
      state.detailIndex,
      state.clearDetailRequest,
      state.setDetailRequest,
      state.setDetailIndex,
      state.loadRequests,
      state.setParams,
      state.loadingRequests,
      state.loadingDetail,
      state.page,
      state.setPage,
      state.totalPage,
      state.limit,
      state.getNotesRequest,
      state.updatesNotes,
    ],
    shallow
  );
  const { setNavigating } = useAgencyRequestStore();

  const careManagerProfile = request?.care_manager?.userprofile || {};
  const loading = loadingRequests || loadingDetail;

  const getUserGroup = (userGroup) => {
    switch (userGroup) {
      case 'Care Agency Admin':
        return 0;
      case 'Care Manager Supervisor':
        return 1;
      default:
        return 2;
    }
  };

  const checkPermission = (request, user) => {
    const requestBelongToUser = request?.care_manager?.id === user?.id;
    const permission = getUserGroup(user.group);
    return requestBelongToUser || permission < 2;
  };

  const user = JSON.parse(localStorage?.CURRENT_USER);
  const hasChangePermission = checkPermission(request, user);

  function close() {
    // clearRequest();
    updatesNotes([]);
    if (index) {
      setNavigating(true);
      window.history.back();
    } else {
      setLocation('/');
    }
  }
  const disablePrevious = page === 0 && index === 0;
  const disableNext = requests.length - 1 === index && page === totalPage - 1;
  async function redirectToDetails(index) {
    const record = requests[index];
    getNotesRequest(record?.id);
    if (record?.id) {
      setLocation(`/request/${record.id}`);
    }
    setIndex(index);
    setRequest(record);
    try {
      await loadRequest(record.id);
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setLocation('/');
      }
    }
  }
  async function previous() {
    let newIndex = index - 1;
    if (newIndex < 0) {
      if (page > 0) {
        setPage(page - 1);
      }
      await loadRequests(
        account,
        params?.id,
        {
          isPrevious: true,
          setLocation,
        },
        accountType
      );
      return;
    }
    return redirectToDetails(newIndex);
  }
  async function next() {
    let newIndex = index + 1;
    if (requests.length === newIndex) {
      setPage(page + 1);
      await loadRequests(
        account,
        params?.id,
        { isNext: true, setLocation },
        accountType
      );
      return;
    }
    return redirectToDetails(newIndex);
  }
  const toggleHidden = async () => {
    try {
      const url = request?.hidden
        ? `api/requests/${request?.id}/unhide/`
        : `api/requests/${request?.id}/hide/`;
      let res = await ax.post(url);
      if (res.status === 201 || res.status === 200) {
        reloadRequest();
      }
    } catch (e) {
      if (request?.hidden) {
        alert('There was an error unhiding this request.');
      } else {
        alert('There was an error hiding this request.');
      }
    }
  };
  const setParamsRequests = (params) => {
try {
  if (params) {
    params = JSON.parse(params);
  }
} catch (error) {
  console.error('Error parsing JSON:', error);
}
      setParams(params);
    }
  };
  const loadPatientRequest = useCallback(
    async (byPassCheckForReloadRequest = true) => {
      if (!params) return;

      try {
        if (request && !byPassCheckForReloadRequest) {
          return;
        }
        getNotesRequest(params?.id);
        let requestParams = localStorage.getItem(
          'careRequestsDetailsViewParams'
        );
        if (requestParams && !byPassCheckForReloadRequest) {
          setParamsRequests(requestParams);
          await loadRequests(account, params?.id, {}, accountType);
        }
        await loadRequest(params?.id);
      } catch (e) {
        if (e?.response?.data?.new_alert_message) {
          alert(
            'This Care Request has been closed. Click OK to return to your dashboard!'
          );
        } else {
          alert('Could not load patient request!');
        }
        setLocation('/');
        return;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params?.id]
  );
  const archiveRequest = async (id, reason, message) => {
    try {
      const payload = { reason };
      if (message) {
        payload.message = message;
      }
      let res = await ax.put(`/api/requests/${id}/archive/`, payload);
      if (res.status === 200) {
        loadRequests();
        closeModal();
        setLocation('/');
      } else {
        alert(
          'There was an error archiving this care request. Please wait and try again.'
        );
      }
    } catch (e) {
      alert(
        'There was an error archiving this care request. Please wait and try again.'
      );
    }
  };
  const unArchiveRequest = async (id) => {
    try {
      let res = await ax.put(`/api/requests/${id}/unarchive/`);
      if (res.status === 200) {
        loadRequests();
        closeModal();
        setLocation('/');
      } else {
        alert(
          'There was an error un-archiving this care request. Please wait and try again.'
        );
      }
    } catch (e) {
      alert(
        'There was an error un-archiving this care request. Please wait and try again.'
      );
    }
  };
  const deleteRequest = async (id, reason, message) => {
    try {
      const payload = { reason };
      if (message) {
        payload.message = message;
      }
      let res = await ax.delete(`/api/requests/${id}/`, { data: payload });
      if (res.status === 204) {
        loadRequests();
        closeModal();
        setLocation('/');
      } else {
        alert(
          'There was an error deleting this care request. Please wait and try again.'
        );
      }
    } catch (e) {
      alert(
        'There was an error deleting this care request. Please wait and try again.'
      );
    }
  };
  const sendAssigningRequest = async (requestId, cmId) => {
    try {
      let res = await ax.post(
        `/api/patients/request/${requestId}/care-manager/${cmId}/`
      );
      if (res.status === 200) {
        loadRequests();
        closeModal();
        setLocation('/');
      } else {
        alert(
          'There was an error changing this patient request. Please wait and try again.'
        );
      }
    } catch (e) {
      alert(
        'There was an error changing this patient request. Please wait and try again.'
      );
    }
  };

  useEffect(() => {
    loadPatientRequest();
  }, [loadPatientRequest]);
  const Navigation = () => {
    return (
      <>
        <Button
          disabled={disablePrevious}
          variant="text"
          color="primary"
          onClick={previous}
        >
          <FlexBox alignItems={'center'}>
            <ChevronLeftIcon /> Previous
          </FlexBox>
        </Button>
        <Typography className={classes.pagination}>
          Request {page * limit + index + 1} of {count}
        </Typography>
        <Button
          disabled={disableNext}
          variant="text"
          color="primary"
          onClick={next}
        >
          <FlexBox alignItems={'center'}>
            Next <ChevronRightIcon />
          </FlexBox>
        </Button>
      </>
    );
  };
  const ProviderStatusBar = () => {
    return (
      <Box
        p={theme.spacing(0.5)}
        pb={0}
        className={clsx(classes.statusBar, {
          [classes.providerStatusBar]: accountType === accountTypes.PROVIDER,
        })}
      >
        <IconButton onClick={close} className={classes.closeButton}>
          <CloseIcon color="primary" />
        </IconButton>
        <FlexBox justifyContent="space-between" mb={2} mr={4}>
          <InputLabel className={classes.sectionLabel}>Case Details</InputLabel>
          <FlexBox alignItems="center">
            <RoleSwitch account>
              <RoleMatch role={accountTypes.PROVIDER}>
                <FlexBox alignItems={'center'}>
                  <Box mr={1}>
                    <AntSwitch
                      checked={request?.hidden}
                      onChange={toggleHidden}
                    />
                  </Box>
                  Hide Case
                </FlexBox>
              </RoleMatch>
            </RoleSwitch>
            {count > 1 && <Navigation />}
          </FlexBox>
        </FlexBox>
        <FlexBox
          p={`${theme.spacing(1)}px ${theme.spacing(3)}px`}
          alignItems="flex-start"
        >
          <Box mr={theme.spacing(1)}>
            <InlineDetail
              label={'Care Manager'}
              detail={`${careManagerProfile.first_name || ''} ${
                careManagerProfile.last_name || ''
              }`}
            />
            <InlineDetail
              label={'Email'}
              detail={request?.care_manager.email}
            />
            <InlineDetail
              label={'Request ID'}
              detail={request?.id.toString() || ''}
            />
          </Box>
          <Box mr={theme.spacing(1)}>
            <InlineDetail
              label={'Organization Name'}
              detail={`${request?.agency_name}`}
              customClassLabel={classes.organizationName}
            />
          </Box>
          <Box mr={theme.spacing(1)}>
            <InlineDetail
              label={'Phone Number'}
              detail={careManagerProfile.phone}
            />
            <InlineDetail
              label={"Patient's Age"}
              detail={request?.patient?.age.toString()}
            />
          </Box>
          <Box mr={theme.spacing(1)}>
            <InlineDetail
              label={'Location (Zip)'}
              detail={request?.patient.zip}
            />
            <InlineDetail
              label={"Patient's Gender"}
              detail={request?.patient.gender}
            />
          </Box>
          <Box mr={theme.spacing(1)}>
            <InputLabel className={classes.sectionLabel}>Status</InputLabel>
            <RequestStatusLabel status={request?.status} />
          </Box>
        </FlexBox>
      </Box>
    );
  };
  const AgencyStatusBar = () => {
    const showEdit = !['Closed', 'Matched'].includes(request?.status);
    const { first_name = '', last_name = '' } = request?.patient || {};
    const showName = first_name || last_name;

    const handleDeleteClick = () => {
      const canDelete = !['Partially Matched', 'Matched', 'Archived'].includes(
        request?.status
      );
      if (canDelete) {
        openModal(
          <ConfirmDialog
            confirm={(reason, message) =>
              deleteRequest(request?.id, reason, message)
            }
            deleteRequest
            title="Delete"
            description="Are you sure you want to delete this? You cannot undo this."
            confirmText="Delete"
            showQuestion
          />
        );
      } else {
        openModal(<DeleteErrorDialog status={request?.status} />);
      }
    };

    return (
      <Box
        p={theme.spacing(0.5)}
        pb={0}
        className={clsx(classes.statusBar, {
          [classes.providerStatusBar]: accountType === accountTypes.PROVIDER,
        })}
      >
        <IconButton onClick={close} className={classes.closeButton}>
          <CloseIcon color="primary" />
        </IconButton>
        <FlexBox justifyContent="space-between" mb={2} mr={4}>
          <InputLabel className={classes.sectionLabel}>
            Patient Details
          </InputLabel>
          <FlexBox alignItems="center">
            {!request?.is_archived && hasChangePermission && (
              <Button
                style={{ marginRight: theme.spacing(1) }}
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={() =>
                  openModal(
                    <ChangeAssigneeModal
                      id={request?.id.toString()}
                      confirm={(careManager) =>
                        sendAssigningRequest(request?.id, careManager)
                      }
                    />
                  )
                }
              >
                Assign
              </Button>
            )}
            {showEdit && (
              <Link href={`/request/edit/${params?.id}`}>
                <Button
                  style={{ marginRight: theme.spacing(1) }}
                  color="primary"
                  startIcon={<EditIcon />}
                >
                  Edit
                </Button>
              </Link>
            )}
            {!request?.is_archived && (
              <Button
                style={{ marginRight: theme.spacing(1) }}
                color="primary"
                startIcon={<ArchiveIcon />}
                onClick={() =>
                  openModal(
                    <ConfirmDialog
                      confirm={(reason, message) =>
                        archiveRequest(request?.id, reason, message)
                      }
                      title="Archive Patient"
                      description="If you want to update the patient’s information choose 'Update existing' if you intended to create a separate patient record choose 'Create new'."
                      confirmText="Archive"
                    />
                  )
                }
              >
                Archive
              </Button>
            )}
            {!!request?.is_archived && (
              <Button
                style={{ marginRight: theme.spacing(1) }}
                color="secondary"
                startIcon={<ArchiveIcon />}
                onClick={() =>
                  openModal(
                    <UserConfirmationDialog
                      confirm={() => unArchiveRequest(request?.id)}
                      title="Unarchive Care Request"
                      description="This will restore the Care Request to the unarchived state."
                      confirmText="Unarchive"
                    />
                  )
                }
              >
                Unarchive
              </Button>
            )}
            <Button
              style={{ marginRight: theme.spacing(1) }}
              className={classes.deleteButton}
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
            {index !== null && count > 1 && <Navigation />}
          </FlexBox>
        </FlexBox>
        <FlexBox
          p={`${theme.spacing(1)}px ${theme.spacing(3)}px`}
          alignItems="flex-start"
        >
          {showName && (
            <Box mr={theme.spacing(1 / 2)}>
              <InlineDetail
                label={'Name'}
                detail={`${first_name} ${last_name}`}
              />
              <InlineDetail label={'Email'} detail={request?.patient?.email} />
            </Box>
          )}
          <Box mr={theme.spacing(1 / 2)}>
            <InlineDetail
              label={'Care Manager'}
              detail={`${careManagerProfile.first_name || ''} ${
                careManagerProfile.last_name || ''
              }`}
            />
            <InlineDetail
              label={'Request ID'}
              detail={request?.id.toString() || ''}
            />
          </Box>
          <FlexBox alignItems="flex-start" mr={theme.spacing(1 / 2)}>
            <InputLabel className={classes.label}>Services</InputLabel>
            <Box>
              {request?.services?.map((service) => {
                return (
                  <InlineDetail
                    key={`ServiceRequested_${service.id}`}
                    label={service.funding_source}
                    detail={service.service}
                  />
                );
              })}
            </Box>
          </FlexBox>
          <Box mr={theme.spacing(1 / 2)}>
            <InlineDetail
              label={'Location (Zip)'}
              detail={request?.patient?.zip}
            />
          </Box>
          <Box mr={theme.spacing(1 / 2)}>
            <InputLabel className={classes.sectionLabel}>Status</InputLabel>
            <RequestStatusLabel status={request?.status} />
          </Box>
          <Box>
            <InputLabel className={classes.sectionLabel}>
              Time Since Posted
            </InputLabel>
            <Timestamp
              expired={hoursSinceNow(request?.refreshed_time) > 48}
const isWarning = hoursSinceNow(request?.refreshed_time) > 24;
<Timestamp>
  {timeAge(request?.refreshed_time)}{' '}
</Timestamp>
          </Box>
        </FlexBox>
      </Box>
    );
  };
  return (
    <LoadingBox loading={loading}>
      <RoleSwitch account>
        <RoleMatch role={accountTypes.AGENCY}>
          <AgencyStatusBar />
          <Tabs>
            <Tabs.Tab label={'Matches'}>
              <AgencyServicesTable request={request} />
            </Tabs.Tab>
            <Tabs.Tab label={'Details'}>
              <RequestDetailsTab request={request} />
            </Tabs.Tab>
            <Tabs.Tab label={'History'}>
              <History request={request} />
            </Tabs.Tab>
          </Tabs>
        </RoleMatch>
        <RoleMatch role={accountTypes.PROVIDER}>
          <ProviderStatusBar />
          <Box padding={4}>
            <ProviderServicesTable
              request={request}
              loadPatientRequest={loadPatientRequest}
            />
            <LabelDivider label="Care Details" variant="body2" mt={4} />
            <CareDetails request={request} />
          </Box>
        </RoleMatch>
      </RoleSwitch>
    </LoadingBox>
  );
};
export default RequestDetailPage;
