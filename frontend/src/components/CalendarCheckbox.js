import React from "react";

function CalendarCheckbox(props) {
  return (
    <div class="sidebarcalendaroptions">
      <input type="checkbox" id={props.name} />
      <label for={props.name} style={{ width: "100%" }}>
        {props.name}
      </label>
    </div>
  );
}

export default CalendarCheckbox;
