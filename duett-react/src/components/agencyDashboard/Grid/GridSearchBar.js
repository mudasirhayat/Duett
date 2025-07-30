import { Box, Button, TextField } from '@material-ui/core';
import Magnifier from '../../../assets/magnifier.png';
import { useStyles } from '../useStyles';
import useFilterSortStore from '../../../store/utility';
import shallow from 'zustand/shallow';
import { useLocation, useRoute } from 'wouter';

const GridSearchBar = ({ searchType, data, setProxyData, hideSearch }) => {
  const style = useStyles();
  const [, params] = useRoute('/client-history/:name/:id');
  const [, setLocation] = useLocation();
  const [
    searchHandler,
    searchVal,
    setSearchVal,
    clearSortFilter,
  ] = useFilterSortStore(
    (state) => [
      state.searchHandler,
      state.searchVal,
      state.setSearchVal,
      state.clearSortFilter,
    ],
    shallow
  );

  const searchUrl = {
    clients: 'clientsearch',
    requests: 'carerequestsearch',
    history: 'clienthistorysearch',
  };

  const startSearch = () => {
    if (searchVal?.trim() === '') {
      clearSortFilter(data, setProxyData);
      return;
    }
    searchHandler(
      searchVal,
      searchUrl[searchType],
      params?.id,
      setLocation,
      data,
      setProxyData
    );
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
        display: hideSearch ? 'none' : '',
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
          variant="contained"
          color="primary"
          className={style.searchClientButton}
          disableElevation={true}
          onClick={startSearch}
        >
          <Box>Search</Box>
        </Button>
      </Box>
    </form>
  );
};

export default GridSearchBar;
