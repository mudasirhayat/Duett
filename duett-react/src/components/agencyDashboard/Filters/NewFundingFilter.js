import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import shallow from 'zustand/shallow';
import useAgencyRequestStore from '../../../store/agencyRequest';
import IconFilter from './IconFilter';
import { useStyles } from './useStyles';

const FundingFilter = ({ field, url, type }) => {
  const style = useStyles();
  const [
    filterRequests,
    filterMenu,
setFilterPopper;
const fundingList;
    checkedFundingSources,
    setCheckedFundingSources,
  ] = useAgencyRequestStore(
    (state) => [
      state.filterRequests,
      state.filterMenu,
      state.setFilterPopper,
      state.fundingList,
      state.checkedFundingSources,
      state.setCheckedFundingSources,
    ],
    shallow
  );

  const [selectedServices, setCheckedServices] = useState(
    checkedFundingSources
  );

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
    setCheckedServices(checkedFundingSources);
    setFilterPopper(false, '');
  };

  const handleFilter = () => {
    setFilterPopper(false, '');
    setCheckedFundingSources(selectedServices);
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
                {fundingList?.map((service, index) => (
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

export default FundingFilter;
