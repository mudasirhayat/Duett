import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  MenuItem,
  RadioGroup,
  Select,
  Radio,
  Typography,
  useTheme,
  Button,
  TextField,
  FormHelperText,
  Snackbar,
  Switch,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import clsx from 'clsx';
import { useLocation } from 'wouter';
import Autocomplete from '@material-ui/lab/Autocomplete';
import debounce from 'lodash.debounce';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import InputAdornment from '@material-ui/core/InputAdornment';
import PlainInput from '../../components/forms/PlainInput';
import PlainInputLabel from '../../components/forms/PlainInputLabel';
import DuettTextField from '../../components/forms/DuettTextField';
import { USStateAbbreviations as USStates } from '../../lib/USStates';
import DrawerPage from '../../components/app/DrawerPage';
import FlexBox from '../../components/layout/FlexBox';
import LabelDivider from '../../components/app/LabelDivider';
import useCareRequestStore from '../../store/careRequests';
import ax from '../../lib/api';
import LoadingButton from '../../components/forms/LoadingButton';
import PlusIcon from '../../components/icons/PlusIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import LoadingBox from '../../components/layout/LoadingBox';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateUs, getDateFromFormattedDate } from '../../lib/dates';
import ChangeAssigneeModal from '../../components/careRequest/ChangeAssigneeModal';
import useStore from '../../store';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(6)}px ${theme.spacing(12)}px`,
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(4),
    },
  },
  errorLabel: {
    [theme.breakpoints.down('md')]: {
      margin: 0,
    },
  },
  inputField: {
    maxWidth: 'calc(100% - 192px)',
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
    },
  },
  divider: {
    flexGrow: 1,
  },
  row: {
    marginBottom: theme.spacing(4),
  },
  radios: {
    flexDirection: 'row',
  },
  icon: {
    cursor: 'pointer',
    marginRight: theme.spacing(1),
  },
  serviceSelect: {
    marginRight: theme.spacing(2),
  },
  shortLabel: {
    width: theme.spacing(8),
  },
  stateSelect: {
    width: 128,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  notes: {
    alignItems: 'flex-start',
  },
  textarea: {
    borderColor: theme.palette.primary.main,
  },
  bottomNone: {
    marginBottom: 0,
  },
  datePickerWrapper: {
    width: 'calc(100% - 136px)',
    '& > .react-datepicker-wrapper': {
      width: '100%',
    },
  },
  charLimitError: {
    color: theme.palette.error.main,
  },
}));

const initialServiceValues = {
  service_type: '',
  hours: '',
  frequency: '',
  funding_source: '',
};

const registerRequired = {
  required: {
    value: true,
    message: 'This field is required.',
  },
};

function calculateAge(birthDate) {
  const currentDate = new Date();
  const yearDiff = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  const dayDiff = currentDate.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    return yearDiff - 1;
  }
  return yearDiff;
}

const emailInvalid = {
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: 'Enter a valid email address',
  },
};

const zipcodeInvalid = {
  pattern: {
    value: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
    message: 'Enter a valid zipcode',
  },
};

const patientFields = [
  'first_name',
  'last_name',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'city',
  'zip',
  'gender',
  'age',
  'birth_date',
];

const patientRequestFields = [
  'request_prior_authorization',
  'transportation_required',
  'hide_manager_contact_info',
  'pets',
  'smoking',
  'equipment',
  'notes',
  'requested_schedule',
];

const frequencies = [
  { name: 'Per Week', value: 1 },
  { name: 'Per Month', value: 2 },
];

const characterLimit = 255;

const RequestForm = ({ detailRequest, requestLoading, requestId }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [fundingSources, getCityStateFromZip] = useCareRequestStore((store) => [
    store.fundingSources,
    store.getCityStateFromZip,
  ]);
  const loadFundingSources = useCareRequestStore(
    (store) => store.loadFundingSources
  );
  const openModal = useStore((state) => state.openModal);
  const closeModal = useStore((state) => state.closeModal);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [nonFieldError, setFieldError] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm();

  const { fields: serviceFields, append, remove } = useFieldArray({
    control,
    name: 'services',
  });

  console.log(
    'detailRequest?.hide_manager_contact_info',
    detailRequest?.hide_manager_contact_info
  );
  const [shareContactInfo, setShareContactInfo] = useState(
    detailRequest?.hide_manager_contact_info || false
  );

  useEffect(() => {
    setShareContactInfo(detailRequest?.hide_manager_contact_info || false);
  }, [detailRequest?.hide_manager_contact_info]);

  const handleToggle = () => {
    setShareContactInfo((prev) => !prev);
  };

  const [loadRequests] = useCareRequestStore((state) => [state.loadRequests]);

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
  const hasChangePermission = checkPermission(detailRequest, user);

  const [existingPatient, setExistingPatient] = useState(); // Existing patient (used for updating a patient)
  const [careRequest, setCareRequest] = useState(); // Existing care request (used for adding services if the care request succeeds and the services fail)
  const [age, setAge] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchValue] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [, setLocation] = useLocation();
  const [deleteIndexes, setDeleteIndexes] = useState([]); // Store delete index while update request
  const [stateValue, setStateValue] = useState('');

  const patientDisable = !!requestId;

  const handleGetLocation = async (e) => {
    const zipcode = e.target.value;
    if (zipcode) {
      const { state, city } = await getCityStateFromZip(zipcode);
      if (USStates.includes(state)) {
        setStateValue(state);
        setValue('state', state);
        if (errors.state) {
          setError('state', null);
        }
      }
      if (city) {
        setValue('city', city);
        if (errors.city) {
          setError('city', null);
        }
      }
    }
  };

  // The Service Types are different for each Service form, the options are collected here
  const [serviceOptions, setServiceOptions] = useState([]);

  const addEmptyService = useCallback(() => {
    append(initialServiceValues);
  }, [append]);

  const handleRemoveService = (index) => {
    if (serviceFields[index].serviceId) {
      setDeleteIndexes((prev) => [...prev, serviceFields[index].serviceId]);
    }
    remove(index);
  };

  const getServices = async (types) => {
    try {
      const apis = types.map((value) =>
        ax.get(`/api/funding-sources/${value}/services/`)
      );
      const allResults = await axios.all(apis);
      const allTypes = {};
      allResults.forEach(({ data }, index) => (allTypes[types[index]] = data));
      return allTypes;
    } catch (e) {
      console.log('err', e.message);
      return {};
    }
  };

  const handleFundingSourceOnChange = async (e, index, onChange) => {
    const { value } = e.target;
    try {
      let res = await ax.get(`/api/funding-sources/${value}/services/`);
      let updatedServiceOptions = [...serviceOptions];
      updatedServiceOptions[index] = res.data;
      setServiceOptions(updatedServiceOptions);
    } catch (e) {
      alert(
        'There was an error getting the funding sources. Please refresh and try again.'
      );
    }
    onChange(e);
  };

  const createOrUpdatePatient = async (data) => {
    try {
      let res;
      if (existingPatient) {
        res = await ax.patch(`/api/patients/${existingPatient.id}/`, data);
      } else {
        res = await ax.post('/api/patients/', data);
      }
      if (res?.status === 201 || res?.status === 200) {
        return res?.data;
      }
    } catch (e) {
      if (typeof e?.response?.data === 'object') {
        const data = e.response.data;
        // removed setError to set in the useForm because it wasn't allow to resubmit the form
        // console error here because haven't decide to which error to show in the form
        // error will move to setState and show in the form once decide what to show.
        if (data.non_field_errors) {
          setShowErrorToast(true);
          setFieldError(data.non_field_errors[0]);
          return null;
        }
        for (const key in data) {
          setError(key, {
            type: 'manual',
            message: data[key],
          });
        }
      }
      return null;
    }
  };

  const createOrUpdateCareRequest = async (patientId, data, id) => {
    try {
      let res;
      if (id) {
        res = await ax.put(`/api/patients/${patientId}/requests/${id}/`, data);
      } else {
        res = await ax.post(`/api/patients/${patientId}/requests/`, data);
      }
      if ([201, 200].includes(res.status)) {
        return res.data;
      }
    } catch (e) {
      if (typeof e?.response?.data === 'object') {
        const data = e.response.data;
        for (const key in data) {
          setError(key, {
            type: 'manual',
            message: data[key],
          });
        }
      }
      return null;
    }
  };

  const editServices = async (requestId, services) => {
    try {
      const apis = services.map((data) => {
        const id = data.serviceId;
        delete data.serviceId;
        return ax.put(`/api/requests/${requestId}/services/${id}/`, data);
      });
      const allResults = await axios.all(apis);
      return allResults
        .filter((result) => result.status === 200)
        .map((result) => result.data);
    } catch (e) {
      console.log('err', e.message);
      return [];
    }
  };

  const deleteServices = async (requestId) => {
    try {
      const apis = deleteIndexes.map((data) =>
        ax.delete(`/api/requests/${requestId}/services/${data}/`)
      );
      const allResults = await axios.all(apis);
      setDeleteIndexes([]);
      return allResults.filter((result) => result.status === 204);
    } catch (e) {
      console.log('e', e.message);
      return [];
    }
  };

  const createOrUpdateServices = async (requestId, data) => {
    try {
      const newData = data.filter((d) => !d.serviceId);
      const editData = data.filter((d) => d.serviceId);
      let serviceResponse = [];
      if (editData.length) {
        serviceResponse = await editServices(requestId, editData);
      }
      if (deleteIndexes.length) {
        await deleteServices(requestId);
      }
      let res = await ax.post(`/api/requests/${requestId}/services/`, newData);
      if (res.status === 201) {
        serviceResponse = [...serviceResponse, ...res.data];
        return serviceResponse;
      }
    } catch (e) {
      const errorsList = e?.response?.data;
      if (errorsList.length) {
        errorsList.forEach((errors, index) => {
          for (const key in errors) {
            setError(`services[${index}].[${key}]`, {
              type: 'manual',
              message: errors[key],
            });
          }
        });
      }
      return null;
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

  const splitData = (data) => {
    let dataCopy = { ...data };
    const servicesData = dataCopy['services'];
    delete dataCopy['services'];

    const requestData = {};
    patientRequestFields.forEach((fieldName) => {
      requestData[fieldName] = dataCopy[fieldName];
      delete dataCopy[fieldName];
    });

    const patientData = dataCopy;

    return { patientData, requestData, servicesData };
  };

  const onSubmit = async (data) => {
    setLoading(true);
    data.birth_date = formatDateUs(data.birth_date);
    const { patientData, requestData, servicesData } = splitData(data);
    requestData['hide_manager_contact_info'] = shareContactInfo;
    try {
      let patient = existingPatient;
      if (!requestId) {
        patient = await createOrUpdatePatient(patientData);
      }
      if (!patient) return;
      setExistingPatient(patient);

      let request =
        careRequest ??
        (await createOrUpdateCareRequest(patient.id, requestData, requestId));
      if (!request) return;
      setCareRequest(request);
      let services = await createOrUpdateServices(request.id, servicesData);
      if (!services) return;

      if (services) {
        setLocation('/');
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getServiceErrors = (index) => {
    return errors?.services?.[index];
  };

  const searchPatients = useCallback(async () => {
    if (searchInput) {
      try {
        setSearchLoading(true);
        const res = await ax.get(`/api/patients/?search=${searchInput}`);
        if (res.status === 200) {
          setOptions(res.data);
        }
      } catch (e) {
        setOptions([]);
        console.log('err', e.message);
      } finally {
        setSearchLoading(false);
      }
    }
  }, [searchInput]);

  const autofillSearchedPatient = (patient) => {
    setExistingPatient(patient);
    patientFields.forEach((field) => {
      const fieldValue = patient[field];
      const value =
        field === 'birth_date' && fieldValue
          ? getDateFromFormattedDate(fieldValue)
          : fieldValue;
      setValue(field, value);
    });
    setStateValue(patient.state);
  };

  const autofillPatientRequestFields = (patient) => {
    patientRequestFields.forEach((field) => {
      const value =
        field === 'notes' ? patient['additional_notes'] : patient[field];
      setValue(field, value);
    });
  };

  const autofillRequest = async ({ services = [], ...rest }) => {
    const types = services.map(
      (s) => fundingSources.find((fs) => fs.name === s.funding_source)?.id
    );
    const uniqueTypes = [...new Set(types)].filter((ut) => !!ut);
    const allTypes = await getServices(uniqueTypes);
    const copyServiceOptions = types.map((t) => allTypes[t] || []);
    setServiceOptions(copyServiceOptions);

    // append empty fields
    const values = services.map((s, i) => ({
      frequency: frequencies.find((f) => f.name === s.frequency).value,
      funding_source: fundingSources.find((fs) => fs.name === s.funding_source)
        ?.id,
      hours: s.hours,
      service: copyServiceOptions[i].find(
        (options) => options.name === s.service
      )?.id,
      serviceId: s.id,
      status: s.status,
      match: s.match,
    }));

    if (values.length) {
      remove(0); // remove first service for edit to force update that existing field.
      values.forEach((value) => append(value));
    }

    // set services values
    // setValue('services', values);
    autofillPatientRequestFields(rest);
  };

  useEffect(() => {
    if (!requestLoading && detailRequest) {
      autofillRequest(detailRequest);
      autofillSearchedPatient(detailRequest?.patient);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestLoading, detailRequest]);

  useEffect(() => {
    loadFundingSources();
  }, [loadFundingSources]);

  useEffect(() => {
    const delayedSearch = debounce(searchPatients, 200);
    delayedSearch();

    return () => {
      delayedSearch.cancel();
    };
  }, [searchInput, searchPatients]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  useEffect(() => {
    addEmptyService();
  }, [addEmptyService]);

  const getRegistered = (
    field,
    validations,
    noValidations = false,
    required = true,
    unregister = false // add an optional unregister parameter
  ) => {
    let params = [field];
    if (!noValidations && !unregister) {
      // only add validations if not unregistering
      const validation = required
        ? { ...validations, ...registerRequired }
        : { ...validations };
      params = [...params, validation];
    }
    const { ref, ...rest } = register(...params);
    return { inputRef: ref, ...rest };
  };

  const registerMaxAge = () => ({
    validate: (value) => {
      if (value) {
        const age = calculateAge(value);
        if (age < 0 || value >= new Date()) {
          setAge(0);
          return `Can't accept future date.`;
        } else {
          setAge(age);
          return true;
        }
      }
      setAge('');
      return `This field is required.`;
    },
  });

  const handleAgeChange = (e) => {
    if (e) {
      const age = calculateAge(e);
      if (age < 0 || e >= new Date()) {
        setAge(0);
      } else {
        setAge(age);
      }
    } else {
      setAge('');
    }
  };

  return (
    <DrawerPage>
      <LoadingBox loading={requestLoading}>
        <div className={classes.root}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography variant="h5" gutterBottom>
              Care Request
            </Typography>
            {!detailRequest?.is_archived &&
              hasChangePermission &&
              existingPatient && (
                <Button
                  style={{ marginRight: theme.spacing(1) }}
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={() =>
                    openModal(
                      <ChangeAssigneeModal
                        id={detailRequest?.id.toString()}
                        confirm={(careManager) =>
                          sendAssigningRequest(detailRequest?.id, careManager)
                        }
                      />
                    )
                  }
                >
                  Assign
                </Button>
              )}
          </Box>
          <Typography variant="subtitle2" gutterBottom>
            Enter the details for your Patient Care Request and click submit.
          </Typography>

          <form
            onSubmit={handleSubmit(
              async (data) => await onSubmit({ ...data, age: age })
            )}
          >
            <Box>
              <Grid item xs={12} md={5}>
                <Autocomplete
                  id="search"
                  open={open}
                  onOpen={() => setOpen(true)}
                  onClose={() => setOpen(false)}
                  options={options}
                  loading={searchLoading}
                  value={searchValue}
                  disabled={patientDisable}
                  onChange={(event, value) => {
                    autofillSearchedPatient(value);
                  }}
                  onInputChange={(event, value) => {
                    setSearchInput(value);
                  }}
                  getOptionLabel={(option) => {
                    return `${option.first_name} ${option.last_name}`;
                  }}
                  renderOption={(option) => {
                    return (
                      <Box>
                        <Typography variant="body1">
                          {option.first_name} {option.last_name}
                        </Typography>
                        <Typography variant="body2">
                          {option.birth_date}
                        </Typography>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Name"
                      InputProps={{
                        ...params.InputProps,
                        disableUnderline: true,
                      }}
                    />
                  )}
                />
              </Grid>
              <Snackbar
                open={showErrorToast}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                onClose={() => setShowErrorToast(false)}
              >
                <Alert elevation={6} variant="filled" severity="error">
                  {nonFieldError}
                </Alert>
              </Snackbar>
              <LabelDivider label="Patient Info" />
              <Grid container>
                <Grid item xs={12}>
                  {existingPatient ? (
                    <Typography variant="body1" color="primary" gutterBottom>
                      Updating: {existingPatient.first_name}{' '}
                      {existingPatient.last_name}
                    </Typography>
                  ) : null}
                </Grid>

                <Grid container item xs={12}>
                  <Grid item xs={12} md={5}>
                    <DuettTextField
                      label="First Name"
                      name="first_name"
                      disabled={patientDisable}
                      {...getRegistered('first_name')}
                      error={!!errors?.first_name}
                      helperText={errors?.first_name?.message}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <DuettTextField
                      label="Last Name"
                      name="last_name"
                      disabled={patientDisable}
                      {...getRegistered('last_name')}
                      error={!!errors?.last_name}
                      helperText={errors?.last_name?.message}
                    />
                  </Grid>
                </Grid>

                <Grid container item xs={12}>
                  <Grid item xs={12} md={5}>
                    <DuettTextField
                      label="Email"
                      name="email"
                      disabled={patientDisable}
                      {...getRegistered('email', emailInvalid, false, false)}
                      error={!!errors?.email}
                      helperText={errors?.email?.message}
                    />
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <DuettTextField
                      label="Phone"
                      name="phone"
                      disabled={patientDisable}
                      {...getRegistered('phone')}
                      error={!!errors?.phone}
                      helperText={errors?.phone?.message}
                    />
                  </Grid>
                </Grid>

                <Grid container item xs={12}>
                  <Grid item xs={12} md={5}>
                    <DuettTextField
                      label="Address"
                      name="address"
                      disabled={patientDisable}
                      {...getRegistered('address')}
                      error={!!errors?.address}
                      helperText={errors?.address?.message}
                    />
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Box>
                        <PlainInput
                          placeholder="Zip"
                          name="zip"
                          disabled={patientDisable}
                          {...getRegistered('zip', zipcodeInvalid)}
                          error={!!errors?.zip}
                          style={{ flex: 1 }}
                          inputProps={{ onBlur: handleGetLocation }}
                        />
                        {errors?.zip ? (
                          <FormHelperText
                            variant="standard"
                            error
                            style={{ margin: 0 }}
                          >
                            {errors?.zip?.message}
                          </FormHelperText>
                        ) : null}
                      </Box>

                      <Box>
                        <PlainInput
                          placeholder="City"
                          name="city"
                          disabled={patientDisable}
                          {...getRegistered('city')}
                          error={!!errors?.city}
                          style={{ flex: 2 }}
                        />
                        {errors?.city ? (
                          <FormHelperText
                            variant="standard"
                            error
                            style={{ margin: 0 }}
                          >
                            {errors?.city?.message}
                          </FormHelperText>
                        ) : null}
                      </Box>

                      <Box className={classes.stateSelect}>
                        <Autocomplete
                          options={USStates}
                          getOptionLabel={(option) => option}
                          getOptionSelected={(option, value) => value}
                          onChange={(e, options) => setValue('state', options)}
                          clearOnBlur={false}
                          disableClearable
                          value={stateValue}
                          disabled={patientDisable}
                          renderInput={(params) => (
                            <DuettTextField
                              {...params}
                              placeholder="State"
                              name="state"
                              margin="none"
                              {...getRegistered('state')}
                              InputProps={{
                                ...params.InputProps,
                                disableUnderline: true,
                              }}
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'disabled',
                              }}
                              classes={{
                                root: classes.bottomNone,
                              }}
                            />
                          )}
                        />
                        {errors?.state ? (
                          <FormHelperText
                            variant="standard"
                            error
                            style={{ margin: 0 }}
                          >
                            {errors?.state?.message}
                          </FormHelperText>
                        ) : null}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Grid container item xs={12}>
                  <Grid item xs={12} md={5}>
                    <FormControl>
                      <PlainInputLabel>
                        Request Prior Authorization
                      </PlainInputLabel>
                      <Controller
                        control={control}
                        name="request_prior_authorization"
                        defaultValue={false}
                        render={({ field: { onChange, value } }) => (
                          <RadioGroup
                            className={classes.radios}
                            value={value}
                            onChange={(e) =>
                              onChange(e.target.value === 'true')
                            }
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <FormControl>
                      <PlainInputLabel>
                        Transportation Required?
                      </PlainInputLabel>
                      <Controller
                        control={control}
                        name="transportation_required"
                        defaultValue={false}
                        render={({ field: { onChange, value } }) => (
                          <RadioGroup
                            className={classes.radios}
                            value={value}
                            onChange={(e) =>
                              onChange(e.target.value === 'true')
                            }
                          >
                            <FormControlLabel
                              value={true}
                              control={<Radio />}
                              label="Yes"
                            />
                            <FormControlLabel
                              value={false}
                              control={<Radio />}
                              label="No"
                            />
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </Grid>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                      <FormControl>
                        <PlainInputLabel>
                          Hide Contact Information from Providers
                        </PlainInputLabel>
                        <Switch
                          checked={shareContactInfo}
                          onChange={handleToggle}
                          name="Share Contact Information"
                          inputProps={{ 'aria-label': 'secondary checkbox' }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container item xs={12}>
                  <Grid item xs={12} md={5}>
                    <FormControl>
                      <PlainInputLabel
                        disabled={patientDisable}
                        error={!!errors?.birth_date}
                      >
                        Birth Date
                      </PlainInputLabel>
                      <div className={classes.datePickerWrapper}>
                        <Controller
                          control={control}
                          name="birth_date"
                          rules={{
                            ...registerMaxAge(),
                          }}
                          render={({ field: { onChange, value } }) => (
                            <ReactDatePicker
                              placeholderText="MM/DD/YYYY"
                              onChange={(e) => {
                                handleAgeChange(e);
                                onChange(e);
                              }}
                              selected={value}
                              disabled={patientDisable}
                              customInput={
                                <TextField
                                  classes={{ root: classes.bottomNone }}
                                  InputProps={{
                                    disableUnderline: true,
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <CalendarTodayIcon fontSize="small" />
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              }
                            />
                          )}
                        />
                      </div>
                      {errors?.birth_date ? (
                        <FormHelperText variant="standard" error>
                          {errors?.birth_date?.message}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container item xs={12}>
                  <Grid item xs={12} md={5}>
                    <FormControl>
                      <PlainInputLabel
                        disabled={patientDisable}
                        error={!!errors?.gender}
                      >
                        Gender
                      </PlainInputLabel>
                      <Controller
                        id="gender-select"
                        control={control}
                        name="gender"
                        defaultValue=""
                        rules={registerRequired}
                        render={({ field }) => (
                          <Select
                            {...field}
                            disabled={patientDisable}
                            displayEmpty
                            disableUnderline
                          >
                            <MenuItem value="" disabled selected>
                              Gender
                            </MenuItem>
                            <MenuItem value="1">Female</MenuItem>
                            <MenuItem value="2">Male</MenuItem>
                            <MenuItem value="3">Other</MenuItem>
                          </Select>
                        )}
                      />

                      {errors?.gender ? (
                        <FormHelperText variant="standard" error>
                          {errors?.gender?.message}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <DuettTextField
                      label="Age"
                      type="number"
                      disabled={true}
                      {...getRegistered('age', {}, false, true, true)} // set unregister to true
                      value={age}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <LabelDivider label="Services Requested" />
              <Grid container>
                {serviceFields.map((item, index) => (
                  <Box width="100%" key={item.id}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={10}>
                        <FlexBox>
                          <FormControl>
                            <PlainInputLabel
                              disabled={!!serviceFields[index].match}
                              error={!!getServiceErrors(index)?.funding_source}
                            >
                              Funding Source
                            </PlainInputLabel>

                            <Controller
                              control={control}
                              name={`services[${index}].funding_source`}
                              defaultValue={
                                serviceFields[index].funding_source || ''
                              }
                              rules={registerRequired}
                              render={({ field: { onChange, value } }) => (
                                <Select
                                  value={value}
                                  disableUnderline={true}
                                  disabled={!!serviceFields[index].match}
                                  displayEmpty
                                  className={classes.inputField}
                                  onChange={(e) =>
                                    handleFundingSourceOnChange(
                                      e,
                                      index,
                                      onChange
                                    )
                                  }
                                >
                                  <MenuItem value="" disabled selected>
                                    Funding Sources
                                  </MenuItem>
                                  {fundingSources.map((source) => (
                                    <MenuItem
                                      key={`FundingSource_${source.id}`}
                                      value={source.id}
                                    >
                                      {source.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              )}
                            />
                            {getServiceErrors(index)?.funding_source ? (
                              <FormHelperText
                                error
                                variant="standard"
                                className={classes.errorLabel}
                              >
                                {
                                  getServiceErrors(index).funding_source
                                    ?.message
                                }
                              </FormHelperText>
                            ) : null}
                          </FormControl>
                        </FlexBox>
                      </Grid>
                      {/* Added hidden field for store service id while edit */}
                      <input
                        type="hidden"
                        defaultValue={serviceFields[index].serviceId || ''}
                        name={`services[${index}].serviceId`}
                        {...register(`services[${index}].serviceId`)}
                      />
                      <Grid item xs={12} md={10}>
                        <FormControl
                          disabled={!serviceOptions?.[index]?.length}
                        >
                          <PlainInputLabel
                            error={!!getServiceErrors(index)?.service}
                            disabled={!!serviceFields[index].match}
                          >
                            Service
                          </PlainInputLabel>
                          <Controller
                            control={control}
                            name={`services[${index}].service`}
                            defaultValue={serviceFields[index].service || ''}
                            rules={registerRequired}
                            render={({ field }) => (
                              <Select
                                {...field}
                                disableUnderline
                                displayEmpty
                                disabled={!!serviceFields[index].match}
                                className={classes.inputField}
                              >
                                <MenuItem value="" disabled selected>
                                  Service Type
                                </MenuItem>
                                {serviceOptions?.[index]?.map((option) => (
                                  <MenuItem
                                    value={option.id}
                                    key={`ServiceOption_${option.id}`}
                                  >
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            )}
                          />

                          {getServiceErrors(index)?.service ? (
                            <FormHelperText
                              error
                              variant="standard"
                              className={classes.errorLabel}
                            >
                              {getServiceErrors(index).service?.message}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <FormControl>
                          <PlainInputLabel
                            error={!!getServiceErrors(index)?.hours}
                          >
                            Hours Requested
                          </PlainInputLabel>
                          <PlainInput
                            type="number"
                            name={`services[${index}].hours`}
                            defaultValue={serviceFields[index].hours}
                            {...getRegistered(`services[${index}].hours`)}
                          />
                          {getServiceErrors(index)?.hours ? (
                            <FormHelperText
                              error
                              variant="standard"
                              className={classes.errorLabel}
                            >
                              {getServiceErrors(index).hours?.message}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={5}>
                        <FormControl>
                          <PlainInputLabel
                            error={!!getServiceErrors(index)?.frequency}
                          >
                            Per Week, Month
                          </PlainInputLabel>
                          <Controller
                            control={control}
                            name={`services[${index}].frequency`}
                            defaultValue={serviceFields[index].frequency}
                            rules={registerRequired}
                            render={({ field }) => (
                              <Select {...field} disableUnderline displayEmpty>
                                <MenuItem value="" disabled selected>
                                  Time
                                </MenuItem>
                                <MenuItem value={1}>Week</MenuItem>
                                <MenuItem value={2}>Month</MenuItem>
                              </Select>
                            )}
                          />
                          {getServiceErrors(index)?.frequency ? (
                            <FormHelperText
                              error
                              variant="standard"
                              className={classes.errorLabel}
                            >
                              {getServiceErrors(index).frequency?.message}
                            </FormHelperText>
                          ) : null}
                        </FormControl>
                      </Grid>
                    </Grid>
                    <FormControl>
                      {serviceFields.length > 1 && index !== 0 && (
                        <React.Fragment>
                          <TrashIcon
                            className={classes.icon}
                            onClick={() => handleRemoveService(index)}
                          />
                          <PlainInputLabel>Remove Service</PlainInputLabel>
                        </React.Fragment>
                      )}
                      {serviceFields.length - 1 === index && (
                        <React.Fragment>
                          <PlusIcon
                            className={classes.icon}
                            onClick={addEmptyService}
                          />
                          <PlainInputLabel>Add Service</PlainInputLabel>
                        </React.Fragment>
                      )}
                    </FormControl>
                  </Box>
                ))}
                <Grid item md={10} container alignItems="flex-start">
                  <Controller
                    name="requested_schedule"
                    rules={registerRequired}
                    render={({ field }) => {
                      const charLimit =
                        characterLimit - (field.value?.length || 0);
                      return (
                        <DuettTextField
                          multiline
                          value={field.value}
                          onChange={field.onChange}
                          inputRef={field.ref}
                          InputProps={{
                            className: classes.textarea,
                            disableUnderline: true,
                            placeholder:
                              'Add additional notes on the schedule of hours here. Do not include client identifying information here.',
                          }}
                          inputProps={{
                            maxLength: characterLimit,
                          }}
                          InputLabelProps={{
                            style: {
                              alignSelf: 'flex-start',
                              marginTop: 8,
                            },
                            shrink: true,
                          }}
                          FormHelperTextProps={{
                            classes: {
                              root: clsx({
                                [classes.charLimitError]: charLimit <= 10,
                              }),
                            },
                          }}
                          rows={4}
                          label="Requested Schedule of Hours"
                          error={!!errors?.requested_schedule}
                          helperText={
                            errors?.requested_schedule?.message ||
                            `Character limit: ${charLimit}`
                          }
                        />
                      );
                    }}
                    control={control}
                  />
                </Grid>
              </Grid>
            </Box>

            <Grid container>
              <LabelDivider label="Additional Details" />
              <Grid item lg={8}>
                <FormControl className={classes.notes}>
                  <PlainInputLabel>Add Additional Details</PlainInputLabel>
                  <DuettTextField
                    multiline={true}
                    InputProps={{
                      className: classes.textarea,
                      disableUnderline: true,
                      placeholder:
                        'Pertinent information to the case/condition of the patient. Do not include identifying information of the patient in this section.',
                    }}
                    rows={4}
                    name="notes"
                    {...getRegistered('notes', null, true)}
                    error={!!errors?.notes}
                    helperText={errors?.notes?.message}
                  />
                </FormControl>
              </Grid>
              <Grid item lg={4}>
                <FormControl>
                  <PlainInputLabel>Pets</PlainInputLabel>
                  <Controller
                    control={control}
                    name="pets"
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup
                        value={value}
                        onChange={(e) => onChange(e.target.value === 'true')}
                        className={classes.radios}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
                <FormControl>
                  <PlainInputLabel>Smoking</PlainInputLabel>
                  <Controller
                    control={control}
                    name="smoking"
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup
                        value={value}
                        onChange={(e) => onChange(e.target.value === 'true')}
                        className={classes.radios}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
                <FormControl>
                  <PlainInputLabel>Equipment</PlainInputLabel>
                  <Controller
                    control={control}
                    name="equipment"
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <RadioGroup
                        value={value}
                        onChange={(e) => onChange(e.target.value === 'true')}
                        className={classes.radios}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>

            <FlexBox>
              <Button
                variant="text"
                color="primary"
                disableElevation={true}
                onClick={() => window.history.back()}
                style={{ marginRight: theme.spacing(2) }}
              >
                Cancel
              </Button>
              <LoadingButton
                variant="contained"
                color="primary"
                disableElevation={true}
                type="submit"
                loading={loading}
              >
                Submit
              </LoadingButton>
            </FlexBox>
          </form>
        </div>
      </LoadingBox>
    </DrawerPage>
  );
};

export default RequestForm;
