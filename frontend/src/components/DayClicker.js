import React from "react";

function DayClicker(props) {
  return (
    <div class="calendarBlock">
      <div
        class={`select ${props.classname}`}
        id={props.id}
        onClick={props.calendarClick}
      >
        <span class={props.classname} id={props.id}>
          {props.element}
        </span>
      </div>
    </div>
  );
}

export default DayClicker;
