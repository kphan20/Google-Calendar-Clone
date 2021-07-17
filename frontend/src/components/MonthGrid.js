import React from "react";
import "./MonthGrid.css";
import DayClicker from "./DayClicker";
import { generateCalendar } from "./utils";
import moment from "moment";

/**
 * Creates single month display
 * @param  {Object} props Passing down viewedDay and setState functions for selectedDay, viewedDay, and displayToggle
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
  const divWrapper = (id, element, classname, calendarClick) => {
    return (
      <div class="grid-cell">
        <div class="cell-clicker">
          <DayClicker
            id={id}
            element={element}
            classname={classname}
            calendarClick={calendarClick}
          />
        </div>
        <div></div>
      </div>
    );
  };
  const calendarClick = (e) => {
    let date = e.target.id;
    props.displayToggle("Day");
    props.changeSelectedDay(moment(date));
    props.changeViewedDay(moment(date));
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
