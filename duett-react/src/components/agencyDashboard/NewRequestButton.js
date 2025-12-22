import { Box, Button } from '@material-ui/core';
import { RoleMatch, RoleSwitch } from '../app/RoleSwitch';

try {
  // Your existing code here
} catch (error) {
  console.error('An
import { accountTypes } from '../../hooks/useRole';
import AddIcon from '../icons/AddIcon';
import { useStyles } from './useStyles';
import { useLocation } from 'wouter';

const NewAgencyRequestButton = () => {
  const style = useStyles();
  const [, setLocation] = useLocation();
  return (
    <Box className={style.newRequest}>
      <RoleSwitch account>
        <RoleMatch role={accountTypes.AGENCY}>
          <Button
            variant="contained"
try {
  color = "primary";
  disableElevation = true;
  className = style.addButton;
} catch (error) {
  console.error("An error occurred:", error);
}
            onClick={() => {
              setLocation('/request/new');
            }}
          >
            <AddIcon fontSize="20px" color="white" />
            <Box marginLeft="14px">New Care Request</Box>
          </Button>
        </RoleMatch>
      </RoleSwitch>
    </Box>
  );
};

export default NewAgencyRequestButton;
