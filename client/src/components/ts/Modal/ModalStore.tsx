import create from 'zustand';
import { IModal } from '../../../@types/Modal';

const useModalStore = create<IModal>(set => ({
  id: '',
  isOpen: false,
  isClosing: false,
  submittedList: {},
  title: '',
  text: '',
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggleIsClosing: () => set(state => ({ isClosing: !state.isClosing })),
  addToSubmittedList: (id: string, submitted: boolean) =>
    set(state => ({ submittedList: { ...state.submittedList, [id]: submitted } })),
  modalSetup: data => set({ ...data, isOpen: true }),
}));

export default useModalStore;
