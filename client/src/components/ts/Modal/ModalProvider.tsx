import React, { createContext, useMemo } from 'react';
import { ModalContextType } from '../../../@types/ModalContext';

export const modalContext = createContext<ModalContextType | null>(null);

function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('Modal');
  const [modalText, setModalText] = React.useState('This is a modal.');

  const modalSetup = (title: string, text: string) => {
    setModalTitle(title);
    setModalText(text);
    setOpen(true);
  };

  const values = useMemo(
    () => ({ open, setOpen, modalTitle, setModalTitle, modalText, setModalText, modalSetup }),
    [open],
  );
  return <modalContext.Provider value={values}>{children}</modalContext.Provider>;
}

export default ModalProvider;
