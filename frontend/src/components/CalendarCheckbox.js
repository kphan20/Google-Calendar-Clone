import React from "react";

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
