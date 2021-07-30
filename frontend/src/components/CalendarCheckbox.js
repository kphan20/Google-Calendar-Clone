import React from "react";

/**
 * Sidebar component that displays user's calendars and allows for toggling their events' visibility
 * @component
 * @param  {Obj} props   name, visibilityToggle, checked, name
 * @return {JSX Element}
 */
function CalendarCheckbox(props) {
  return (
    <div className="sidebarcalendaroptions">
      <input
        type="checkbox"
        id={props.name}
        onChange={props.visibilityToggle}
        checked={props.checked}
      />
      <label htmlFor={props.name} style={{ width: "100%" }}>
        {props.name}
      </label>
    </div>
  );
}

export default CalendarCheckbox;
