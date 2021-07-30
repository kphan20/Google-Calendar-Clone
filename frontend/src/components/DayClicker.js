import React from "react";

/**
 * Component that represents clickable dates with different onClick behavior based on current display mode
 * @component
 * @param  {Obj} props   classname, id, calendarClick, element
 * @return {JSX Element}
 */
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
