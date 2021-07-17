import React from "react";

function DayClicker(props) {
  return (
    <div className="calendarBlock">
      <div
        className={`select ${props.classname}`}
        id={props.id}
        onClick={props.calendarClick}
      >
        <span className={props.classname} id={props.id}>
          {props.element}
        </span>
      </div>
    </div>
  );
}

export default DayClicker;
