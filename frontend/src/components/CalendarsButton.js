import React, { useState } from "react";
import "./CalendarsButton.css";
import CalendarCheckbox from "./CalendarCheckbox";

function CalendarsButton(props) {
  const [openState, toggle] = useState(true);
  const [checked, toggleChecked] = useState(true);
  const arrow = openState ? "^" : "v";
  function onClick() {
    toggle(!openState);
  }

  let calendarsArray = []; //new Array(3).fill(<CalendarCheckbox name="Example" />);
  let groupCalendars = props.calendars[props.group];
  for (const calendar in groupCalendars) {
    const visibilityToggle = () => {
      props.updateCalendars((prevState) => {
        prevState[props.group][calendar]["visibility"] =
          !prevState[props.group][calendar]["visibility"];
        toggleChecked(prevState[props.group][calendar]["visibility"]);
        return { ...prevState };
      });
    };
    calendarsArray.push(
      <CalendarCheckbox
        name={calendar.split("\\")[1]}
        visibilityToggle={visibilityToggle}
        checked={checked}
      />
    );
  }
  return (
    <>
      <button id="calendars-drop-down" onClick={onClick}>
        <span id="container">
          <p>{props.name}</p>
          <p>{arrow}</p>
        </span>
      </button>
      {openState && <div id="calendars">{calendarsArray}</div>}
    </>
  );
}

export default CalendarsButton;
