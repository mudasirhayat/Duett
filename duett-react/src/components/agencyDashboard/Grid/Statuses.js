import { Box } from '@material-ui/core';
import { useStyles } from '../useStyles';

const statuses = {
  'Partially Matched': {
    dot: '#CCA010',
    chip: '#FBE9AE',
    text: '#7F6204',
  },
  Open: {
    dot: '#14BA6D',
    chip: '#ECFDF3',
    text: '#037847',
  },
  'Submissions Received': {
    dot: '#F14344',
    chip: '#FED2CF',
    text: '#F14344',
  },
  default: {
    dot: 'grey',
    chip: 'lightGrey',
    text: 'grey',
  },
};

const ActiveStatuses = ({ status }) => {
  const styles = statuses[status] || statuses.default;
  const style = useStyles(styles);

  const isPartialMatched = status === 'Partially Matched' ? true : false;

  return (
    <Box className={style.chipStyle}>
      <Box className={style.statusStyle}>
        <Box className={style.dotStyle} />
        <Box
          className={`${style.textStyle} ${
            isPartialMatched ? style.statusChipStyle : ''
          }`}
        >
          {status === 'Submissions Received' ? 'Received' : status}
        </Box>
      </Box>
    </Box>
  );
};

export default ActiveStatuses;
