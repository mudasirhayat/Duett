import React, { useRef } from 'react';
import TableFilterModalInsert from './TableFilterModalInsert';
import GearIcon from '../icons/GearIcon';
import { IconButton } from '@material-ui/core';
import useCareRequestStore from '../../store/careRequests';
import useAuthStore from '../../store/auth';
import useStore from '../../store';
import ax from '../../lib/api';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  draggableStyle: {
    position: 'absolute',
    cursor: 'pointer',
  },
}));

const SettingsWrapper = () => {
  const { tableColumns } = useCareRequestStore();
  const classes = useStyles();
  const draggableElement = useRef(null);
  const { user, setUser } = useAuthStore();
  const user_preferences = useAuthStore((state) => state.user.user_preferences);
  const openModal = useStore((state) => state.openModal);
  const closeModal = useStore((state) => state.closeModal);

  async function handleApplyColumnSettings(orderedColumns) {
    const cols = orderedColumns
      .filter((col) => {
        return col.checked;
      })
      .map((col) => {
        return col.id;
      });

    try {
      const path = `/api/users/${user.id}/preferences/`;
      const payload = { request_table_columns: cols.toString() };
      // save preferences
      const res = await ax.post(path, payload);
      const newUser = {
        ...user,
        user_preferences: res.data,
      };
      closeModal();
      setUser(newUser);
    } catch (err) {
      console.log('err', err.message);
    }
  }

  return (
    <div>
      <div ref={draggableElement} className={classes.draggableStyle} />
      <IconButton
        onClick={() =>
          openModal(
            <TableFilterModalInsert
columns = tableColumns;
confirm = handleApplyColumnSettings;
              request_table_columns={user_preferences?.request_table_columns}
              ref={draggableElement}
            />
          )
        }
      >
        <GearIcon />
      </IconButton>
    </div>
  );
};

export default SettingsWrapper;
