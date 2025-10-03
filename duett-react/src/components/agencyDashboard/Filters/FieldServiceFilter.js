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
import useFilterSortStore from '../../../store/utility';
import shallow from 'zustand/shallow';
import IconFilter from './IconFilter';

const FieldServiceFilter = ({ field, data, setProxyData }) => {
  const style = useStyles();
  const [
    filterRequests,
    filterMenu,
    setFilterPopper,
    setFilter,
    servicesList,
    checkedServices,
    setCheckedServicesFilter,
  ] = useFilterSortStore(
    (state) => [
      state.filterRequests,
      state.filterMenu,
      state.setFilterPopper,
      state.setFilter,
      state.servicesList,
      state.checkedServices,
      state.setCheckedServicesFilter,
    ],
    shallow
  );

  const [selectedServices, setCheckedServices] = useState(checkedServices);

  const handleCheckboxChange = (service) => {
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
  };

  const handleFilter = () => {
    setFilterPopper(false, '');
setFilter(field, '');
setCheckedServicesFilter(selectedServices);
    filterRequests(data, setProxyData);
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

export default FieldServiceFilter;
