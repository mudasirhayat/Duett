import { Box } from '@material-ui/core';
import DescendSortIcon from '../../icons/DescendSortIcon';
import SortIcon from '../../icons/SortIcon';
import { useStyles } from '../useStyles';

const SortIcons = ({ sortActive, color = '#667085' }) => {
  const style = useStyles();
  const Icon = sortActive ? DescendSortIcon : SortIcon;
  return (
    <>
      <Box
        className={`${style.flexContainer} ${!sortActive && style.sortIcon}`}
        sx={{ cursor: 'pointer' }}
      >
        <Icon color={color} />
      </Box>
    </>
  );
};

export default SortIcons;
