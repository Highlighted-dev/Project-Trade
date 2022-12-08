import { Dispatch, SetStateAction } from 'react';

export type ModalContextType = {
  open: boolean | null;
  setOpen: Dispatch<SetStateAction<boolean>>;
  modalTitle: string | null;
  setModalTitle: Dispatch<SetStateAction<string>>;
  modalText: string | null;
  setModalText: Dispatch<SetStateAction<string>>;
  modalSetup: (title: string, text: string) => void;
};
