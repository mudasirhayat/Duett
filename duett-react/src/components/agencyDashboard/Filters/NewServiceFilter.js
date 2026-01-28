import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import { useStyles } from './useStyles';
import useAgencyRequestStore from '../../../store/agencyRequest';
import shallow from 'zustand/shallow';
import IconFilter from './IconFilter';

const ServiceFilter = ({ field, url, type }) => {
  const style = useStyles();
  const [
    filterRequests,
    filterMenu,
    setFilterPopper,
    servicesList,
    checkedServices,
    setCheckedServicesFilter,
  ] = useAgencyRequestStore(
    (state) => [
      state.filterRequests,
      state.filterMenu,
      state.setFilterPopper,
      state.servicesList,
      state.checkedServices,
  const [selectedServices, setCheckedServices] = useState(checkedServices);
  const handleCheckboxChange = (service) => {
    try {
      const updatedServices = selectedServices.map((item) =>
        item.id === service
    if (selectedServices?.includes(service)) {
      setCheckedServices(selectedServices?.filter((item) => item !== service));
    } else {
      setCheckedServices([...selectedServices, service]);
    }
  };

  const handleClick = () => {
    setFilterPopper(true, field);
  };

  const handleClickAway = () => {
setCheckedServices(checkedServices);
setFilterPopper(false, '');

const handleFilter = () => {
    setFilterPopper(false, '');
    setCheckedServicesFilter(selectedServices);
    filterRequests(url, type);
  };

  const open = filterMenu.popField === field && filterMenu.open;

  return (
    <>
      <Box onClick={handleClick}>
        <IconFilter />
      </Box>
      {open ? (
        <form>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box className={style.requestFilterBox}>
              <FormGroup className={style.formGroupStyle}>
                {servicesList?.map((service, index) => (
                  <FormControlLabel
                    key={index}
                    className={style.formControllLabelStyle}
                    control={
                      <Checkbox
                        className={style.checkbox}
                        value={service}
                        checked={selectedServices?.includes(service)}
                        onChange={() => handleCheckboxChange(service)}
                      />
                    }
                    label={service}
                  />
                ))}
              </FormGroup>{' '}
              <Box sx={{ alignSelf: 'flex-end' }} onClick={handleFilter}>
                <Button className={style.apply}>Apply</Button>
              </Box>
            </Box>
          </ClickAwayListener>
        </form>
      ) : null}
    </>
  );
};

export default ServiceFilter;
