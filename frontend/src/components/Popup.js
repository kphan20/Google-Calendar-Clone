import React, { useEffect, useState, useRef } from "react";

function Popup(props) {
  const checkOutsideClick = useRef(null);
  const handleOutsideClick = (e) => {
    if (
      checkOutsideClick.current &&
      !checkOutsideClick.current.contains(e.target)
    ) {
      props.changeContent(<div></div>);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);
  let style = {
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
