import { Box } from '@material-ui/core';
import FilterIcon from '../../icons/FilterIcon';
import { useStyles } from '../useStyles';

const IconFilter = ({ color = '#667085' }) => {
  const style = useStyles();
  return (
    <>
      <Box className={`${style.flexContainer} ${style.filterIconStyle}`}>
        <FilterIcon color={color} />
      </Box>
    </>
  );
};

export default IconFilter;
