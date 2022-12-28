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
  const modal_background_spring_style = useSpring({
    config: { duration: 300 },
    opacity: modalStates.isOpen && !modalStates.isClosing ? 1 : 0,
  });
  const modal_container_spring_style = useSpring({
    y: modalStates.isOpen && !modalStates.isClosing ? 0 : 24,
  });
  return (
    <>
      {modalStates.isOpen && (
        <animated.div style={modal_background_spring_style} id="modalBackground">
          <animated.div style={modal_container_spring_style} className="modalContainer">
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
          </animated.div>
        </animated.div>
      )}
    </>
  );
}
export default Modal;
