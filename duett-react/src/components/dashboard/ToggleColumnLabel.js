import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import FlexBox from '../layout/FlexBox';

const useStyles = makeStyles(() => ({
  root: { cursor: 'pointer' },
}));

const ToggleColumnLabel = ({ label, sortLabel, sort, setSort, ...rest }) => {
  const classes = useStyles();
  const match = sort.includes(sortLabel);
  const ascending = !sort.startsWith('-');

  function handleOnClick() {
    if (!match) {
      setSort(sortLabel);
      return;
    }

    if (ascending) {
      setSort(`-${sortLabel}`);
    } else {
      setSort(sortLabel);
    }
  }

const OrderArrow = () => {
  if (!match) {
    return null;
  }
};
    }

    return ascending ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };

  return (
    <Typography
      onClick={handleOnClick}
      className={classes.root}
      variant="subtitle1"
      variantMapping={{
        subtitle1: 'div',
      }}
      {...rest}
    >
      <FlexBox alignItems="center">
        {label} <OrderArrow />
      </FlexBox>
    </Typography>
  );
};

ToggleColumnLabel.propTypes = {
  label: PropTypes.string.isRequired,
  sortLabel: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
};

export default ToggleColumnLabel;
