import React from "react";
import moment from "moment";
import "./MonthCalendar.css";
import DayClicker from "./DayClicker";

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

  const firstDayOfMonth = () => {
    let dateObject = selectedDay;
    let firstDay = moment(dateObject).startOf("month").format("d");
    return firstDay;
  };

  const previousMonthFormat = (format) => {
    let dateObject = selectedDay;
    let lastDay = moment(dateObject)
      .subtract(1, "months")
      .endOf("month")
      .format(format);
    return lastDay;
  };
  const currentMonthFormat = (format) => {
    let dateObject = selectedDay;
    return moment(dateObject).format(format);
  };
  const nextMonthFormat = (format) => {
    let dateObject = selectedDay;
    let lastDay = moment(dateObject)
      .add(1, "months")
      .endOf("month")
      .format(format);
    return lastDay;
  };
  const lastDayOfMonth = () => {
    let dateObject = selectedDay;
    let lastDay = moment(dateObject).endOf("month").format("D");
    return lastDay;
  };
  // const divWrapper = (element, id, classname) => {
  //   return (
  //     <div class="calendarBlock">
  //       <div class={`select ${classname}`} id={id} onClick={calendarClick}>
  //         <span class={classname} id={id}>
  //           {element}
  //         </span>
  //       </div>
  //     </div>
  //   );
  // };
  let monthCalendar = [];
  let firstDay = parseInt(firstDayOfMonth());
  if (firstDay !== "0") {
    let lastDay = previousMonthFormat("D");
    let lastMonth = previousMonthFormat("MMM");
    let lastYear = previousMonthFormat("YYYY");
    for (let x = 0; x < firstDay; x++) {
      let getDay = parseInt(lastDay) - (firstDay - x) + 1;
      monthCalendar.push(
        <DayClicker
          element={getDay}
          id={`${lastMonth}-${getDay}-${lastYear}`}
          classname="notCurrentMonth"
          calendarClick={calendarClick}
        />
      );
    }
  }
  let currentMonthString = currentMonthFormat("MMM");
  let currentYearString = currentMonthFormat("YYYY");
  for (let x = 1; x <= parseInt(lastDayOfMonth()); x++) {
    monthCalendar.push(
      <DayClicker
        element={x}
        id={`${currentMonthString}-${x}-${currentYearString}`}
        classname="currentMonth"
        calendarClick={calendarClick}
      />
    );
  }
  let endDayPadder = 1;
  let nextMonthString = nextMonthFormat("MMM");
  let nextYearString = nextMonthFormat("YYYY");
  while (monthCalendar.length < 42) {
    monthCalendar.push(
      <DayClicker
        element={endDayPadder}
        id={`${nextMonthString}-${endDayPadder}-${nextYearString}`}
        classname="notCurrentMonth"
        calendarClick={calendarClick}
      />
    );
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
