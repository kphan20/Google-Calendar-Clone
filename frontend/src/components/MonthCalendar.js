import React from "react";
import moment from "moment";
import "./MonthCalendar.css";
import DayClicker from "./DayClicker";
import { generateCalendar } from "./utils";

function MonthCalendar(props) {
  let selectedDay = moment(props.viewDay);
  let weekdays = moment.weekdays();
  let weekdaysmin = moment.weekdaysMin();
  let calendarHeader = [];
  let calendarClick = (e) => {
    let date = e.target.id;
    props.changeDay(moment(date));
    props.changeView(moment(date));
  };
  weekdays.forEach((day, index) => {
    calendarHeader.push(
      <div class="calendarBlock">
        <span title={day}>{weekdaysmin[index]}</span>
      </div>
    );
  });
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
  const maxSize = (arr) => {
    return 42;
  };
  let rows = generateCalendar(selectedDay, divWrapper, calendarClick, maxSize);
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
    <div class="calendar">
      <div class="calendarRow">{calendarTitle}</div>
      <div class="calendarRow">{calendarHeader}</div>
      {rows.map((row) => (
        <div class="calendarRow">{row}</div>
      ))}
    </div>
  );
}

export default MonthCalendar;
