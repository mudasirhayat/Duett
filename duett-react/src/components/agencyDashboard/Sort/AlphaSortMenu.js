import {
  Box,
  ClickAwayListener,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import DescendSortIcon from '../../icons/DescendSortIcon';
import SortIcon from '../../icons/SortIcon';
import useFilterSortStore from '../../../store/utility';
import shallow from 'zustand/shallow';
import { sortLambda } from './SortLambda';
import { BpCheckedIcon, BpIcon, useStyles } from './useStyles';

function BpRadio(props) {
  return (
    <Radio
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
}

const Icons = ({ sortActive, color = '#667085', handleClick }) => {
  const style = useStyles();
  const Icon = sortActive ? DescendSortIcon : SortIcon;
  return (
    <>
      <Box
        className={`${style.flexContainer} ${!sortActive && style.sortIcon}`}
        onClick={handleClick}
      >
        <Icon color={color} />
      </Box>
    </>
  );
};

const AlphaSortMenu = ({ field, proxyData, setProxyData }) => {
  const style = useStyles();
  const [
    sortRequest,
    popper,
    setPopper,
    setAplhaSortPopper,
  ] = useFilterSortStore(
    (state) => [
      state.sortRequest,
      state.popper,
      state.setPopper,
      state.setAplhaSortPopper,
    ],
    shallow
  );

  const handleClick = () => {
    if (popper.popField === 'clientName' && popper.popValue && !popper.open) {
      setAplhaSortPopper(true);
    } else {
      setPopper(true, field);
    }
  };

  const handleClickAway = () => {
    setAplhaSortPopper(false);
  };

  const handleSort = (field, active) => {
    sortRequest(
      sortLambda[field],
      active,
      active,
      field,
      proxyData,
      setProxyData
    );
  };

  const handleChange = (event) => {
    handleSort(field, event.target.value);
  };

  const open = popper.popField === field && popper.open;

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Icons
          sortActive={popper.popField === field && popper.popValue}
          handleClick={handleClick}
        />
        {open ? (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box className={style.sortBox}>
              <FormControl className={style.formControl}>
                <FormLabel className={style.formLabel}>Sort</FormLabel>
                <RadioGroup value={popper.popValue} onChange={handleChange}>
                  <FormControlLabel
                    className={style.formControlLabel}
                    value="asc"
                    control={<BpRadio />}
                    label="A-Z"
                  />
                  <FormControlLabel
                    className={style.formControlLabel}
                    value="desc"
                    control={<BpRadio />}
                    label="Z-A"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </ClickAwayListener>
        ) : null}
      </Box>
    </>
  );
};
export default AlphaSortMenu;
