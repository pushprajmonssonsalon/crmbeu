import React, { useRef } from "react";
import "./Modal.css";
const Modal = ({show,setShow,children}) => {
  const modalRef = useRef(null);
  const openModal = () => {
    setShow(true);
  };
  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.classList.remove("slide-in-top");
      modalRef.current.classList.add("slide-out-bottom");

      // Delay hiding the modal until after the transition finishes
      setTimeout(() => {
        setShow(false);
        modalRef.current.classList.remove("slide-out-bottom");
        modalRef.current.classList.add("slide-in-top"); // Reset for future opens
      }, 300); // 300ms matches the transition duration (should match your CSS)
    }
  };
  return (
    <>
      {/* Main modal */}
      {show && (
        <div
       
          id="select-modal"
          className=" overflow-y-hidden overflow-x-hidden bg-black bg-opacity-50 fixed top-0 right-0 left-0 ma z-50 justify-center items-center w-full md:inset-0 h-full"
        >
          {React.cloneElement(children, { closeModal,openModal ,modalRef})}

        </div>
      )}
    </>
  );
};

export default Modal;
