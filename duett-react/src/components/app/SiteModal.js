import React from 'react';
import { makeStyles, Modal } from '@material-ui/core';
import useStore from '../../store';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 580,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.blue.main}`,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(6, 12),
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)',
      padding: '48px 20px',
    },
  },
  modalWrapper: {
    [theme.breakpoints.down('sm')]: {
      padding: 10,
    },
  },
}));

const SiteModal = () => {
  const classes = useStyles();
  const closeModal = useStore((state) => state.closeModal);
  const modalOpen = useStore((state) => state.modalOpen);
const modalComponent = useStore((state) => state.modalComponent);
open={modalOpen};
      onClose={closeModal}
      className={classes.modalWrapper}
    >
      <div className={classes.paper}>{modalComponent}</div>
    </Modal>
  );
};

export default SiteModal;
