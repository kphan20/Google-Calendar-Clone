import React, { useState } from "react";
import moment from "moment";
import "./MonthCalendar.css";

function MonthCalendar(props) {
  const [selectedDay, changeDay] = useState(moment());
  let weekdays = moment.weekdays();
  let weekdaysmin = moment.weekdaysMin();
  let calendarHeader = [];
  let calendarClick = (e) => {
    let date = e.target.id;
    console.log(date);
  };
  weekdays.forEach((day, index) => {
    calendarHeader.push(
      <div class="calendarBlock">
        <span title={day}>{weekdaysmin[index]}</span>
      </div>
    );
  });

  const firstDayOfMonth = () => {
    let dateObject = selectedDay;
    let firstDay = moment(dateObject).startOf("month").format("d");
    return firstDay;
  };

  const lastDayOfPreviousMonth = () => {
    let dateObject = selectedDay;
    let lastDay = moment(dateObject)
      .subtract(1, "months")
      .endOf("month")
      .format("D");
    return lastDay;
  };
  const lastDayOfMonth = () => {
    let dateObject = selectedDay;
    let lastDay = moment(dateObject).endOf("month").format("D");
    return lastDay;
  };
  const divWrapper = (element, id) => {
    return (
      <div class="calendarBlock">
        <div class="select">
          <span id={id} onClick={calendarClick}>
            {element}
          </span>
        </div>
      </div>
    );
  };
  let monthCalendar = [];
  let firstDay = parseInt(firstDayOfMonth());
  if (firstDay !== "0") {
    let lastDay = parseInt(lastDayOfPreviousMonth());
    for (let x = 0; x < firstDay; x++) {
      monthCalendar.push(divWrapper(lastDay - (firstDay - x) + 1));
    }
  }
  for (let x = 1; x <= parseInt(lastDayOfMonth()); x++) {
    monthCalendar.push(divWrapper(x, x));
  }
  let endDayPadder = 1;
  while (monthCalendar.length < 42) {
    monthCalendar.push(divWrapper(endDayPadder));
    endDayPadder++;
  }

  let rows = [];
  let cells = [];
  monthCalendar.forEach((element, i) => {
    cells.push(element);
    if ((i + 1) % 7 === 0) {
      rows.push(cells);
      cells = [];
    }
  });
  let calendarTitle = props.sidebar ? (
    <div>
      {selectedDay.format("MMMM YYYY")}
      <button>&lt;</button>
      <button>&gt;</button>
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
