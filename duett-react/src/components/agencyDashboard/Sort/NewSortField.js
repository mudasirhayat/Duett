import React from 'react';
import SortIcons from '../Sort/SortIcons';
import { Box } from '@material-ui/core';

const SortField = ({ sortLabel, sort, setSort }) => {
  const match = sort?.includes(sortLabel);
  const ascending = !sort?.startsWith('-');

  const activeIcon = match && ascending;

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
    return <SortIcons sortActive={activeIcon} />;
  };

  return (
    <Box onClick={handleOnClick}>
      <OrderArrow />
    </Box>
  );
};

export default SortField;
