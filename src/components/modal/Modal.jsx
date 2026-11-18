import React, { useEffect, useRef } from "react";
import "./Modal.css";
// Share one lock so closing overlapping modals cannot restore stale styles.
let scrollLockCount = 0;
let restorePageScroll;

const lockPageScroll = () => {
  if (scrollLockCount === 0) {
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const html = document.documentElement;
    const body = document.body;
    const previous = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    };
    const paddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;

    restorePageScroll = () => {
      html.style.overflow = previous.htmlOverflow;
      body.style.overflow = previous.bodyOverflow;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      body.style.paddingRight = previous.bodyPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }
  scrollLockCount += 1;
  return () => {
    scrollLockCount -= 1;
    if (scrollLockCount === 0) {
      restorePageScroll();
      restorePageScroll = undefined;
    }
  };
};

const Modal = ({show,setShow,children,overlayClassName="bg-black bg-opacity-50",scrollWithin=false,lockScroll=false,closeOnBackdrop=false}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!show || !lockScroll) return;
    return lockPageScroll();
  }, [show, lockScroll]);
  const openModal = () => {
    setShow(true);
  };
  const closeModal = () => {
    if (modalRef.current) {
      modalRef?.current?.classList?.remove("slide-in-top");
      modalRef?.current?.classList?.add("slide-out-bottom");

      // Delay hiding the modal until after the transition finishes
      setTimeout(() => {
        setShow(false);
        modalRef?.current?.classList?.remove("slide-out-bottom");
        modalRef?.current?.classList?.add("slide-in-top"); // Reset for future opens
      }, 300); // 300ms matches the transition duration (should match your CSS)
    }
  };
  return (
    <>
      {/* Main modal */}
      {show && (
        <div
          id="select-modal"
          onClick={(e) => {
            if (closeOnBackdrop && e.target === e.currentTarget) closeModal();
          }}
          className={`${scrollWithin ? "overflow-hidden flex overscroll-contain" : "overflow-y-auto overflow-x-hidden"} ${overlayClassName} fixed inset-0 ma z-50 justify-center items-center w-full h-full`}
        >
          {React.cloneElement(children, { closeModal,openModal ,modalRef})}

        </div>
      )}
    </>
  );
};

export default Modal;
