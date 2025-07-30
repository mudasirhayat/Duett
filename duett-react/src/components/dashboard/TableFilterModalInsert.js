import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography, useTheme } from '@material-ui/core';

import DraggableList from './DraggableList';
import FlexBox from '../layout/FlexBox';
import useStore from '../../store';

const TableFilterModalInsert = forwardRef(({ columns, confirm, request_table_columns }, ref) => {
  const theme = useTheme();
  const closeModal = useStore((state) => state.closeModal);
  const [orderedColumns, setOrderedColumns] = React.useState([]);

  return (
    <>
      <Typography variant="h2" gutterBottom>
        Column Settings
      </Typography>

      <DraggableList
        request_table_columns={request_table_columns}
        columns={columns}
        orderedColumns={orderedColumns}
        setOrderedColumns={setOrderedColumns}
        ref={ref}
      />

      <FlexBox>
        <Button
          variant="contained"
          color="primary"
          disableElevation={true}
          onClick={() => confirm(orderedColumns)}
        >
          Apply Settings
        </Button>
        <Button
          variant="text"
          color="primary"
          disableElevation={true}
          onClick={closeModal}
          style={{ marginRight: theme.spacing(2) }}
        >
          Cancel
        </Button>
      </FlexBox>
    </>
  );
});

TableFilterModalInsert.propTypes = {
  confirm: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
};

export default TableFilterModalInsert;


