import { Box, Button, ClickAwayListener, TextField } from '@material-ui/core';
import shallow from 'zustand/shallow';
import useFilterSortStore from '../../../store/utility';
import { useStyles } from './useStyles';
import FilterIcon from '../../icons/FilterIcon';
import { useState } from 'react';
import IconFilter from './IconFilter';

const FieldFilter = ({ field, data, setProxyData }) => {
  const style = useStyles();
  const [
    filterRequests,
    filterMenu,
    setFilterPopper,
    setFilter,
    filters,
  ] = useFilterSortStore(
    (state) => [
      state.filterRequests,
      state.filterMenu,
      state.setFilterPopper,
      state.setFilter,
      state.filters,
    ],
    shallow
  );

  const [value, setValue] = useState(filters[field] || '');

  const handleClick = () => {
    if (filters[field]) {
      setValue(filters[field]);
    } else {
      setValue('');
    }
    setFilterPopper(true, field);
  };

  const handleClickAway = () => {
    setFilterPopper(false, '');
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const open = filterMenu.popField === field && filterMenu.open;

  const handler = () => {
    setFilter(field, value);
    filterRequests(data, setProxyData);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handler();
  };

  return (
    <>
      <Box onClick={handleClick}>
        <IconFilter />
      </Box>
      {open ? (
        <form onSubmit={handleSubmit}>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box className={style.filterBox}>
              <Box className={style.filterTextField}>
                <TextField
                  autoFocus
                  className={style.textField}
                  InputProps={{
                    className: style.filterInput,
                  }}
                  value={value}
                  onChange={(event) => handleChange(event)}
                />
                <Button
                  style={{ marginLeft: '10px' }}
                  color="secondary"
                  onClick={handler}
                  variant="contained"
                >
                  <FilterIcon color="white" />
                  Filter
                </Button>
              </Box>
            </Box>
          </ClickAwayListener>
        </form>
      ) : null}
    </>
  );
};

export default FieldFilter;
