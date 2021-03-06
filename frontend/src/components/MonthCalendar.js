import React from "react";
import moment from "moment";
import "./MonthCalendar.css";
import DayClicker from "./DayClicker";
import { generateCalendar } from "./utils";
/**
 * Creates single month display for "Year" display option and sidebar calendar
 * @component
 * @param  {Object} props viewedDay, calendarClick, changeView, sidebar
 * @return {JSX Element}
 */
function MonthCalendar(props) {
  let selectedDay = moment(props.viewedDay);
  let weekdays = moment.weekdays();
  let weekdaysmin = moment.weekdaysMin();
  let calendarHeader = [];

  weekdays.forEach((day, index) => {
    calendarHeader.push(
      <div className="calendarBlock">
        <span title={day}>{weekdaysmin[index]}</span>
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
      <DayClicker
        id={id}
        element={element}
        classname={classname}
        calendarClick={calendarClick}
      />
    );
  };
  // function used in generateCalendar call to get calendar size (6 weeks)
  const maxSize = (arr) => {
    return 42;
  };

  let rows = generateCalendar(
    selectedDay,
    divWrapper,
    props.calendarClick,
    maxSize
  );
  const nextMonth = () => {
    props.changeView(selectedDay.add(1, "month"));
  };
  const previousMonth = () => {
    props.changeView(selectedDay.subtract(1, "month"));
  };
  let calendarTitle = props.sidebar ? (
    <div id="calendarHead">
      <p id="monthText">{selectedDay.format("MMMM YYYY")}</p>
      <div>
        <button onClick={previousMonth}>&lt;</button>
        <button onClick={nextMonth}>&gt;</button>
      </div>
    </div>
  ) : (
    <div>{selectedDay.format("MMMM")}</div>
  );
  return (
    <div className="calendar">
      <div className="calendarRow">{calendarTitle}</div>
      <div className="calendarRow">{calendarHeader}</div>
      {rows.map((row) => (
        <div className="calendarRow">{row}</div>
      ))}
    </div>
  );
}

export default MonthCalendar;
