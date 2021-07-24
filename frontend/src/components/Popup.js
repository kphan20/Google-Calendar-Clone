import React, { useEffect, useRef } from "react";
/**
 * Represents any popups on the page
 * @component
 * @param  {Obj} props changeContent, changeCoordinates, coords, formFlag, popUpContent, toggleFormFlag
 * @return {JSX Element}  Popup container and inner content
 */
function Popup(props) {
  const checkOutsideClick = useRef(null);
  /**
   * Clears popup upon click outside of popup container
   * @param  {Event} e Click event
   * @return {void}
   */
  const handleOutsideClick = (e) => {
    if (
      checkOutsideClick.current &&
      !checkOutsideClick.current.contains(e.target)
    ) {
      props.changeContent();
      props.toggleFormFlag();
    }
  };

  // Adds event listener to page
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Positions popup differently depending on if its a form or not
  let style = props.formFlag
    ? { zIndex: 5, backgroundColor: "#FFFFFF", position: "fixed" }
    : {
        position: "fixed",
        top: `${props.coords.y}px`,
        left: `${props.coords.x}px`,
        backgroundColor: "#FFFFFF",
        zIndex: 5,
      };
  return (
    <div id="pop-up" style={style} ref={checkOutsideClick}>
      {props.popUpContent}
    </div>
  );
}

export default Popup;
