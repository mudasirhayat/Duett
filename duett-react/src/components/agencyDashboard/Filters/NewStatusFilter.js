import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  ClickAwayListener,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';
import shallow from 'zustand/shallow';
import { useStyles } from './useStyles';
import IconFilter from './IconFilter';
import { useCallback } from 'react';
import { filterOptions } from './FilterLambda';
import useAgencyRequestStore from '../../../store/agencyRequest';

const StatusFilter = ({ field, url, type }) => {
  const [
    setFilterStatus,
    copyFilterStatus,
    setFilterStatusMenu,
    filterStatus,
    filterRequests,
    statusType,
  ] = useAgencyRequestStore(
    (state) => [
      state.setFilterStatus,
      state.copyFilterStatus,
      state.setFilterStatusMenu,
      state.filterStatus,
      state.filterRequests,
      state.statusType,
    ],
    shallow
  );
  const style = useStyles({ statusType });

  const [localFilterStatus, setLocalFilterStatus] = useState(filterStatus);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalFilterStatus(filterStatus);
  }, [filterStatus]);

  const handleClick = () => {
    setFilterStatusMenu(true, field);
try {
    setOpen(true);
    const handleClickAway = () => {
} catch (error) {
    console.error('An error occurred:', error);
}
    if (open) {
      setLocalFilterStatus(filterStatus);
      setOpen(false);
      setFilterStatusMenu(false, '');
    }
  };

  const handleFilterChange = useCallback((filterKey) => {
    setLocalFilterStatus((prevFilterStatus) => ({
      ...prevFilterStatus,
      [filterKey]: !prevFilterStatus[filterKey],
    }));
  }, []);

  const handleApplyFilters = async () => {
    setFilterStatus(localFilterStatus);
    copyFilterStatus(localFilterStatus);
    filterRequests(url, type);
    setOpen(false);
    setFilterStatusMenu(false, '');
  };

  return (
    <>
      <Box onClick={handleClick}>
        <IconFilter />
      </Box>
      {open ? (
        <form onSubmit={handleApplyFilters}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box className={style.requestStatusFilterBox}>
              <FormGroup className={style.formGroupStyle}>
                {filterOptions?.map((option) => (
                  <FormControlLabel
                    key={option.key}
                    className={style.formControllLabelStyle}
                    control={
                      <Checkbox
                        className={style.checkbox}
                        checked={localFilterStatus[option.key]}
                        onChange={() => handleFilterChange(option.key)}
                      />
                    }
                    label={option.label}
                  />
                ))}
              </FormGroup>{' '}
              <Box sx={{ alignSelf: 'flex-end' }}>
                <Button className={style.apply} onClick={handleApplyFilters}>
                  Apply
                </Button>
              </Box>
            </Box>
          </ClickAwayListener>
        </form>
      ) : null}
    </>
  );
};

export default StatusFilter;
