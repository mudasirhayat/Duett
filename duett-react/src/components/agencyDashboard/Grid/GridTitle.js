import { Box } from '@material-ui/core';
import { useStyles } from '../useStyles';

const GridTitle = ({ title, name = null }) => {
  const classes = useStyles();
  const style = classes;

  // Rest of the code
};

  return (
    <Box className={style.gridTitle}>
      {title}
      {name && (
        <span className={style.clientName}>
          {' >'} {name} History
        </span>
      )}
    </Box>
  );
};

export default GridTitle;
