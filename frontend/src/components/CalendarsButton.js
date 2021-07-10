import React, { useState } from "react";
import "./CalendarsButton.css";
import CalendarCheckbox from "./CalendarCheckbox";

function CalendarsButton(props) {
  const [openState, toggle] = useState(true);
  let filledArray = new Array(3).fill(<CalendarCheckbox name="Example" />);
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
