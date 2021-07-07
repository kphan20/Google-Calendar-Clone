import React, { useState } from "react";
import "./CalendarsButton.css";

function CalendarsButton(props) {
  const [openState, toggle] = useState(true);
  let filledArray = new Array(3).fill(<div>Example</div>);
  const arrow = openState ? "^" : "v";
  function onClick() {
    toggle(!openState);
  }
  return (
    <>
      <a onClick={onClick}>
        <div id="container">
          <p>{props.name}</p>
          <p>{arrow}</p>
        </div>
      </a>
      {openState && <div id="calendars">{filledArray}</div>}
    </>
  );
}

export default CalendarsButton;
