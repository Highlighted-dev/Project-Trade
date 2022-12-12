import { useContext } from 'react';
import { ModalContextType } from '../../../@types/Modal';
import { modalContext } from './ModalProvider';

function Modal() {
  const { open, setOpen, modalText, modalTitle, setIsSubmitted } = useContext(
    modalContext,
  ) as ModalContextType;
  function decline() {
    console.log('decline');
    setOpen(false);
  }
  function submit() {
    setIsSubmitted(true);
    setOpen(false);
  }
  return (
    <>
      {open && (
        <div id="modalBackground">
          <div className="modalContainer">
            <button type="button" className="titleCloseBtn" onClick={decline}>
              x
            </button>
            <div className="title">{modalTitle}</div>
            <div className="body">
              <p>{modalText}</p>
            </div>
            <div className="footer">
              <button type="button" onClick={submit}>
                OK
              </button>
              <button type="button" onClick={decline}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Modal;
