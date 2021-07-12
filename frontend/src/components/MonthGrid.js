import React from "react";
import "./MonthGrid.css";
import { generateCalendar } from "./utils";
import moment from "moment";

/**
 * Creates single month display
 * @param  {Object} props Desired format of date string representation
 * @return {<div>}        String representation of viewedMonth
 */
function MonthGrid(props) {
  let viewedMonth = moment(props.viewedDay);

  let daysOfWeek = moment.weekdaysShort();

  let weekDayHeader = daysOfWeek.map((dayName) => {
    return (
      <div>
        <p>{dayName}</p>
      </div>
    );
  });
  const divWrapper = (id) => {
    return (
      <div class="grid-cell">
        <div>{id}</div>
        <div></div>
      </div>
    );
  };
  const calendarClick = () => {
    console.log("success");
  };
  const maxSize = (arr) => {
    return arr.length > 35 ? 42 : 35;
  };

  let rows = generateCalendar(viewedMonth, divWrapper, calendarClick, maxSize);

  return (
    <div id="monthGridContainer">
      <div id="weekDayHeader">{weekDayHeader}</div>
      <div id="daysGrid">
        {rows.map((row) => (
          <div id="gridrow">{row}</div>
        ))}
      </div>
    </div>
  );
}

export default MonthGrid;
