import { Box, Button } from '@material-ui/core';
import { useStyles } from '../useStyles';
import ResetIcon from '../../icons/ResetIcon';
import useAgencyRequestStore from '../../../store/agencyRequest';

const NewGridReset = ({ resetGrid, url, type }) => {
  const style = useStyles();
  const { setSearching } = useAgencyRequestStore();

  return (
    <Button
      onClick={() => {
        resetGrid(true, type);
        setSearching(false);
      }}
    >
      <ResetIcon color="#3F6C7B" fontSize="50px" />
      <Box className={style.reset}>Reset</Box>
    </Button>
  );
};

export default NewGridReset;
