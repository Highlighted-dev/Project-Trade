import { animated, useSpring } from 'react-spring';
import useModalStore from './ModalStore';

function Modal() {
  const modalStates = useModalStore();
  function handleSubmit(submitted: boolean) {
    modalStates.toggleIsClosing();
    setTimeout(() => {
      modalStates.close();
      modalStates.toggleIsClosing();
    }, 300);
    if (submitted) {
      console.log('accepted');
    } else {
      console.log('declined');
    }
  }
  const react_spring_styles = useSpring({
    config: { duration: 300 },
    opacity: modalStates.isOpen && !modalStates.isClosing ? 1 : 0,
    y: modalStates.isOpen && !modalStates.isClosing ? 0 : 24,
  });
  return (
    <>
      {modalStates.isOpen && (
        <animated.div style={react_spring_styles} id="modalBackground">
          <div className="modalContainer">
            <button type="button" className="titleCloseBtn" onClick={() => handleSubmit(false)}>
              x
            </button>
            <div className="title">{modalStates.title}</div>
            <div className="body">
              <p>{modalStates.text}</p>
            </div>
            <div className="footer">
              <button type="button" onClick={() => handleSubmit(true)}>
                OK
              </button>
              <button type="button" onClick={() => handleSubmit(false)}>
                Cancel
              </button>
            </div>
          </div>
        </animated.div>
      )}
    </>
  );
}
export default Modal;
