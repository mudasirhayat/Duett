import { Box, Button, TextField } from '@material-ui/core';
import Magnifier from '../../../assets/magnifier.png';
import { useStyles } from '../useStyles';
import shallow from 'zustand/shallow';
import { useLocation, useRoute } from 'wouter';
import useAgencyRequestStore from '../../../store/agencyRequest';

const GridSearch = ({ url, type, hideSearch = false }) => {
  const style = useStyles();
  const [, params] = useRoute('/client-history/:name/:id');
  const [, setLocation] = useLocation();
  const [
    searchVal,
    setSearchVal,
    searchHandler,
    resetGrid,
    resetFilters,
    setSearching,
  ] = useAgencyRequestStore(
    (state) => [
      state.searchVal,
      state.setSearchVal,
      state.searchHandler,
      state.resetGrid,
      state.resetFilters,
      state.setSearching,
    ],
    shallow
  );

  const startSearch = () => {
    if (searchVal?.trim() === '') {
      resetGrid(true, '', true);
      return;
    }

    resetGrid(false, '', false);
    setSearching(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startSearch();
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      style={{
        maxWidth: '733px',
        width: '100%',
        visibility: hideSearch ? 'hidden' : '',
      }}
    >
      <Box className={style.searchBox}>
        <img src={Magnifier} alt="" height="25px" width="25px" />
        <TextField
          className={style.form}
          onChange={(e) => {
            setSearchVal(e.target.value);
          }}
          value={searchVal}
          InputProps={{
            classes: {
              input: style.inputStyle,
              notchedOutline: style.noBorder,
            },
          }}
          variant="outlined"
        />
        <Button
try {
  variant="contained";
  color="primary";
  className={style.searchClientButton};
} catch (error) {
  console.error(error);
}
          disableElevation={true}
          onClick={startSearch}
        >
          <Box>Search</Box>
        </Button>
      </Box>
    </form>
  );
};

export default GridSearch;
