import { Box } from '@material-ui/core';
import useFilterSortStore from '../../../store/utility';
import { sortLambda } from './SortLambda';
import shallow from 'zustand/shallow';
import SortIcons from './SortIcons';

const SortHeader = ({ field, simpleSortOption, proxyData, setProxyData }) => {
  const [sortActive, sortField, sortRequest] = useFilterSortStore(
    (state) => [state.sortActive, state.sortField, state.sortRequest],
    shallow
  );

  const isSortActive = sortActive && sortField === field;

  const handleSort = (field, active) => {
    sortRequest(
      sortLambda[field],
      active ? 'desc' : 'asc',
      !active,
      field,
      proxyData,
      setProxyData
    );
  };

  return (
    <>
      {simpleSortOption && (
        <Box onClick={() => handleSort(field, isSortActive)}>
          <SortIcons sortActive={isSortActive} />
        </Box>
      )}
    </>
  );
};

export default SortHeader;
