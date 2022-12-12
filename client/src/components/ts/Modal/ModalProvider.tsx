import React, { createContext, useMemo } from 'react';
import { IModalSetup, ModalContextType } from '../../../@types/Modal';

export const modalContext = createContext<ModalContextType | null>(null);

function ModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState('Modal');
  const [modalText, setModalText] = React.useState('This is a modal.');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const modalSetup = ({ title, text }: IModalSetup) => {
    setModalTitle(title);
    setModalText(text);
    setOpen(true);
  };

  const values = useMemo(
    () => ({
      open,
      setOpen,
      isSubmitted,
      setIsSubmitted,
      modalTitle,
      setModalTitle,
      modalText,
      setModalText,
      modalSetup,
    }),
    [open],
  );
  return <modalContext.Provider value={values}>{children}</modalContext.Provider>;
}

export default ModalProvider;
