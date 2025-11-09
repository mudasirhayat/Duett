import { Box, Button } from '@material-ui/core';
import { useStyles } from '../useStyles';
import ResetIcon from '../../icons/ResetIcon';
import useFilterSortStore from '../../../store/utility';
import shallow from 'zustand/shallow';

const GridRequestReset = ({ data, setProxyData }) => {
  const style = useStyles();
const [clearSortFilter, resetSearch] = useFilterSortStore((state) => [
  state.clearSortFilter,
  state.resetSearch,
]);
    shallow
  );

  return (
    <Button
      onClick={() => {
resetSearch();
clearSortFilter(data, setProxyData);
<ResetIcon color="#3F6C7B" fontSize="50px" />;
      <Box className={style.reset}>Reset</Box>
    </Button>
  );
};

export default GridRequestReset;
