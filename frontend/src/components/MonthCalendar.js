import React from "react";
import moment from "moment";
import "./MonthCalendar.css";
import DayClicker from "./DayClicker";
import { generateCalendar } from "./utils";

const popUpWrapper = (content) => {
  if (Array.isArray(content)) {
    content = content.map((item) => {
      return <div>{item}</div>;
    });
  }
  return <div id="popupBox">{content}</div>;
};
function MonthCalendar(props) {
  let selectedDay = moment(props.viewDay);
  let weekdays = moment.weekdays();
  let weekdaysmin = moment.weekdaysMin();
  let calendarHeader = [];

  const calendarClick = (e) => {
    let date = e.target.id;
    props.changeSelectedDay(moment(date));
    props.changeView(moment(date));
    if (!props.sidebar) {
      if (props.testingDates[date] !== undefined) {
        props.changeContent(popUpWrapper(props.testingDates[date]));
      } else {
        props.changeContent(popUpWrapper("No events scheduled"));
      }
      props.changeCoordinates({ x: e.nativeEvent.x, y: e.nativeEvent.y });
    }
  };
  weekdays.forEach((day, index) => {
    calendarHeader.push(
      <div className="calendarBlock">
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
