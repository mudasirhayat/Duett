import React from 'react';
import { TableCell, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import ToggleColumnLabel from './ToggleColumnLabel';

const CareRequestColumn = ({ column: { name, sort_label }, sort, setSort }) => {
  function ColumnLabel() {
    // This checks if the column is sortable
    return (
      <>
        {sort_label ? (
          <ToggleColumnLabel
            sortLabel={sort_label}
            sort={sort}
            setSort={setSort}
            label={name}
          />
        ) : (
          <Typography
            variant="subtitle1"
            variantMapping={{
              subtitle1: 'div',
            }}
          >
            {name}
          </Typography>
        )}
      </>
    );
  }

  return (
    <TableCell>
      <ColumnLabel />
    </TableCell>
  );
};

CareRequestColumn.propTypes = {
  column: PropTypes.object.isRequired,
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
};

export default CareRequestColumn;
