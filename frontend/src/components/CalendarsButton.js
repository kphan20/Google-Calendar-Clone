import React, { useState } from "react";
import "./CalendarsButton.css";

function CalendarsButton(props) {
  const [openState, toggle] = useState(true);
  let filledArray = new Array(3).fill(<div class="calendar">Example</div>);
  const arrow = openState ? "^" : "v";
  function onClick() {
    toggle(!openState);
  }
  return (
    <>
      <button id="calendars-drop-down" onClick={onClick}>
        <span id="container">
          <p>{props.name}</p>
          <p>{arrow}</p>
        </span>
      </button>
      {openState && <div id="calendars">{filledArray}</div>}
    </>
  );
}

export default CalendarsButton;
