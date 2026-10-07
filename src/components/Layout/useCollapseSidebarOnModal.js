import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

/**
 * Collapse the sidebar to its icon rail whenever a modal opens.
 *
 * Modals here come in four shapes and share no common component:
 *   - react-modal          (AddCustomerModal, EditCustomerModal, CustomModal, ...)
 *   - components/modal/Modal.jsx  (ApplyMembership, ViewServicesModal, ...)
 *   - the popup/* family   (hand-rolled `fixed z-40 inset-0` overlays)
 *   - GlobalAlert's ReminderModal
 *
 * Wiring each one up individually would mean touching ~20 files and would still
 * miss the next modal somebody writes. So instead of asking every modal to
 * announce itself, watch the DOM for anything that behaves like one: a fixed
 * overlay stacked at or above the sidebar.
 */

// The sidebar rail sits at z-40. Its own mobile backdrop is z-30, deliberately
// below it - that one must not count, or opening the drawer would close it.
const SIDEBAR_Z_INDEX = 40;

const isModalOpen = () => {
  // react-modal puts this on <body> for as long as a modal is mounted.
  if (document.body.classList.contains("ReactModal__Body--open")) return true;

  const overlays = document.querySelectorAll(".fixed.inset-0, .ReactModal__Overlay");
  for (const overlay of overlays) {
    const style = window.getComputedStyle(overlay);
    if (style.position !== "fixed") continue;
    if (style.display === "none" || style.visibility === "hidden") continue;
    if (Number(style.zIndex) >= SIDEBAR_Z_INDEX) return true;
  }
  return false;
};

const useCollapseSidebarOnModal = () => {
  const dispatch = useDispatch();
  const { open } = useSelector((state) => state.SidebarReducer);

  // Read the current value through a ref so the observer is attached once for
  // the life of the layout rather than being torn down on every toggle.
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    let frame = null;

    const check = () => {
      frame = null;
      if (!openRef.current) return;      // already collapsed, nothing to do
      if (!isModalOpen()) return;
      // Same pair the collapse button dispatches, so a modal-triggered collapse
      // leaves the sidebar in exactly the state a manual one would.
      dispatch({ type: "TOGGLE_ACCORDION", payload: false });
      dispatch({ type: "TOGGLE_SIDEBAR", payload: false });
    };

    // Batch to one check per frame: a single modal opening touches the DOM many
    // times, and class changes anywhere on the page wake the observer.
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(check);
    };

    schedule();   // in case a modal is already open when the layout mounts

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => {
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [dispatch]);
};

export default useCollapseSidebarOnModal;
