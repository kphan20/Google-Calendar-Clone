import React from "react";
import "./MonthGrid.css";
import DayClicker from "./DayClicker";
import { generateCalendar } from "./utils";
import moment from "moment";

/**
 * Creates single month display for "Month" display option
 * @component
 * @param  {Object} props Passing down viewedDay and setState functions for selectedDay, viewedDay, and displayToggle
 * @return {JSX Element}
 */
function MonthGrid(props) {
  // saves copy of viewedDay
  let viewedMonth = moment(props.viewedDay);

  // generates list of divs containing the weekday names
  let daysOfWeek = moment.weekdaysShort();

  let weekDayHeader = daysOfWeek.map((dayName) => {
    return (
      <div>
        <p>{dayName}</p>
      </div>
    );
  });

  /**
   * Creates appropriate JSX element for each month day
   * @param  {String} id              HTML attributes
   * @param  {String} element
   * @param  {String} className
   * @param  {function} calendarClick handles onClick behavior
   * @return {JSX Element}
   */
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
  /**
   * onClick behavior of dates on month view; redirects to "Day" view
   * @param  {Event} e click event
   * @return {void}
   */
  const calendarClick = (e) => {
    let date = e.target.id;
    props.displayToggle("Day");
    props.changeSelectedDay(moment(date));
    props.changeViewedDay(moment(date));
  };
  /**
   * Used to determine size of month grid (5-6 weeks)
   * @param  {Array}  arr array of month grid cells
   * @return {Number} desired size
   */
  const maxSize = (arr) => {
    return arr.length > 35 ? 42 : 35;
  };

  // generateCalendar function from utils to create 2D array
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
