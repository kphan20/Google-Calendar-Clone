import React, { useState } from "react";
import "./CalendarsButton.css";
import CalendarCheckbox from "./CalendarCheckbox";

/**
 * Sidebar component that contains CalendarCheckBox components
 * @component
 * @param  {Obj} props   calendars, group, updateCalendars, name
 * @return {JSX Element}
 */
function CalendarsButton(props) {
  const [openState, toggle] = useState(true); // Used to handle dropdown behavior
  const [checked, toggleChecked] = useState(true); // Used to indicate calendar visibility
  const arrow = openState ? "^" : "v";

  /**
   * onClick behavior for calendars dropdown
   * @return {void}
   */
  function onClick() {
    toggle(!openState);
  }

  let calendarsArray = [];
  let groupCalendars = props.calendars[props.group];
  for (const calendar in groupCalendars) {
    // updates calendars state and checked state if user clicks CalendarCheckbox component
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
