import create from 'zustand';
import { devtools } from 'zustand/middleware';

const store = (set) => ({
  modalOpen: false,
  modalComponent: null,
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),
  openModal: (component) => {
    set((state) => ({
      modalComponent: component,
      modalOpen: true,
    }));
  },
  closeModal: (component) => {
    set((state) => ({
      modalComponent: null,
      modalOpen: false,
    }));
  },

  isDrawerOpen: true,
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
});

let useStore;
if (process.env.NODE_ENV !== 'production') {
  useStore = create(devtools(store));
} else {
  useStore = create(store);
}

export default useStore;
