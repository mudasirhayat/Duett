import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { createPortal } from 'react-dom';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // change background colour if dragging
  background: isDragging ? 'lightgray' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver, overflow) => ({
  // background: isDraggingOver ? 'lightblue' : 'grey',
  // width: 250,
  // maxHeight: '50vh',
  // overflow,
});

const RenderListItem = ({ labelId, item, handleToggle, disabled, innerRef, ...rest }) => {
  return(
    <ListItem
      onClick={() => handleToggle(item)}
      dense
      button={!disabled}
      ref={innerRef}
      {...rest}
    >
      {item.content}
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={item.checked}
          tabIndex={-1}
          disableRipple
          disabled={disabled}
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemIcon>
      <ListItemText id={labelId} primary={item.name} />
      <DragHandleIcon />
    </ListItem>
  )
};

const DraggableList = forwardRef(({ overflow, request_table_columns, columns, orderedColumns, setOrderedColumns }, ref) => {
  const optionalPortal = (styles, element) => {
    if(styles.position === 'fixed') {
      return createPortal(element, ref.current);
    }
    return element;
  }

  useEffect(() => {
    if (request_table_columns) {
      const columnPreferences = request_table_columns.split(',').map((n) => parseInt(n))

      let sortedCols = [];
      columnPreferences.forEach((columnPref) => {
        const tempCol = columns.find((col) => {
          return columnPref === col.id
        })
        if (tempCol) {
          sortedCols.push({...tempCol, checked: true})
        }
      })

      let tempCols = [];
      columns.forEach((column) => {
        if (!request_table_columns.includes(column.id)) {
          tempCols.push({...column, checked: false})
        }
      })

      setOrderedColumns([...sortedCols, ...tempCols])
    } else {
      setOrderedColumns(columns.map((col) => ({...col, checked: true})))
    }
  }, [columns, request_table_columns, setOrderedColumns])

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const tempItems = reorder(
      orderedColumns,
      result.source.index,
      result.destination.index,
    );

    setOrderedColumns(tempItems)
  }

  const handleToggle = (item) => {
    if (item.name !== "ID") {
      const index = orderedColumns.indexOf(item);

      const tempCols = [...orderedColumns];
      tempCols[index].checked = !tempCols[index].checked;

      setOrderedColumns(tempCols);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(droppableProvided, droppableSnapshot) => (
            <List
              ref={droppableProvided.innerRef}
              style={getListStyle(
                droppableSnapshot.isDraggingOver,
                overflow,
              )}
              onScroll={(e) =>
                // TODO: determine fuctionality if need to scroll columns
                // eslint-disable-next-line no-console
                console.log('current scrollTop', e.currentTarget.scrollTop)
              }
            >
              {orderedColumns.map((item, index) => {
                const labelId = `checkbox-list-label-${item.id}`;
                const listItemProps = {
                  handleToggle,
                  item:item,
                  labelId:labelId,
                };

                if(index === 0) return(
                  <RenderListItem disabled key={labelId} {...listItemProps} />
                );

                return (
                  <Draggable
                    key={labelId}
                    draggableId={labelId}
                    index={index}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <>
                        {optionalPortal(
                          draggableProvided.draggableProps.style,
                          <RenderListItem
                            {...listItemProps}
innerRef={draggableProvided.innerRef}
dragHandleProps={draggableProvided.dragHandleProps}
draggableProps={draggableProvided.draggableProps}
                            style={getItemStyle(
                              draggableSnapshot.isDragging,
                              draggableProvided.draggableProps.style,
                            )}
                          />
                        )}
                      </>
                    )}
                  </Draggable>
                );
              })}
              {droppableProvided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </>

  );
})

DraggableList.propTypes = {
  request_table_columns: PropTypes.string,
  columns: PropTypes.array.isRequired,
  orderedColumns: PropTypes.array.isRequired,
  setOrderedColumns: PropTypes.func.isRequired
};

export default DraggableList;
