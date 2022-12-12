import { Dispatch, SetStateAction } from 'react';

export type ModalContextType = {
  open: boolean | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isSubmitted: boolean | null;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  modalTitle: string | null;
  setModalTitle: Dispatch<SetStateAction<string>>;
  modalText: string | null;
  setModalText: Dispatch<SetStateAction<string>>;
  modalSetup: (IModalSetup) => void;
};
export interface IModalSetup {
  title: string;
  text: string;
}
