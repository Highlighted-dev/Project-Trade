import create from 'zustand';
import { IModal } from '../../../@types/Modal';

const useModalStore = create<IModal>(set => ({
  isOpen: false,
  isClosing: false,
  title: '',
  text: '',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleIsClosing: () => set(state => ({ isClosing: !state.isClosing })),
  modalSetup: data => set({ ...data, isOpen: true }),
}));

export default useModalStore;
