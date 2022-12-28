import { animated, useSpring } from 'react-spring';
import useModalStore from './ModalStore';

function Modal() {
  const modalStates = useModalStore();
  const animationDuration = 300;

  function handleSubmit(submitted: boolean) {
    modalStates.toggleIsClosing();
    // Timeout is needed to prevent modal from closing before animation is finished
    setTimeout(() => {
      modalStates.close();
      modalStates.toggleIsClosing();
    }, animationDuration);
    modalStates.addToSubmittedList(modalStates.id, submitted);
  }
  const modal_background_spring_style = useSpring({
    config: { duration: animationDuration },
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
