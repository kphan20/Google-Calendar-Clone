import React, { useState } from "react";
import moment from "moment";
import "./Calendar.css";

function Calendar(props) {
  const [selectedDay, changeDay] = useState(moment());
  let weekdays = moment.weekdays();
  let weekdayshort = moment.weekdaysShort();
  let weekdaysmin = moment.weekdaysMin();
  let calendarHeader = [];
  weekdays.forEach((day, index) => {
    calendarHeader.push(
      <div class="calendarBlock">
        <span title={day}>{weekdaysmin[index]}</span>
      </div>
    );
  });

  const firstDayOfMonth = () => {
    let dateObject = selectedDay;
    let firstDay = moment(dateObject).startOf("month");
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
  const divWrapper = (element) => {
    return (
      <div class="calendarBlock">
        <span>{element}</span>
      </div>
    );
  };
  let monthCalendar = [];
  let firstDay = parseInt(firstDayOfMonth().format("d"));
  if (firstDay !== "0") {
    let lastDay = parseInt(lastDayOfPreviousMonth());
    for (let x = 0; x < parseInt(firstDay); x++) {
      monthCalendar.push(divWrapper(lastDay - (firstDay - x) + 1));
    }
  }
  for (let x = 1; x <= parseInt(lastDayOfMonth()); x++) {
    monthCalendar.push(divWrapper(x));
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
  return (
    <>
      <div class="calendarRow">{calendarHeader}</div>
      {rows.map((row) => (
        <div class="calendarRow">{row}</div>
      ))}
    </>
  );
}

export default Calendar;
