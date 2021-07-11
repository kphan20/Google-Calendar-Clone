import React from "react";
import "./MonthGrid.css";
import moment, { weekdays } from "moment";

function MonthGrid(props) {
  let viewedMonth = moment(props.viewedDay).startOf("month");
  let daysOfWeek = moment.weekdaysShort();

  let bruh = daysOfWeek.map((dayName) => {
    return (
      <div>
        <p>{dayName}</p>
      </div>
    );
  });
  let monthDays = [];
  const divWrapper = (id) => {
    return (
      <div class="grid-cell">
        <div>{id}</div>
        <div></div>
      </div>
    );
  };
  const firstDayOfMonth = () => {
    let dateObject = viewedMonth;
    let firstDay = moment(dateObject).startOf("month").format("d");
    return firstDay;
  };

  const previousMonthFormat = (format) => {
    let dateObject = viewedMonth;
    let lastDay = moment(dateObject)
      .subtract(1, "months")
      .endOf("month")
      .format(format);
    return lastDay;
  };
  const currentMonthFormat = (format) => {
    let dateObject = viewedMonth;
    return moment(dateObject).format(format);
  };
  const nextMonthFormat = (format) => {
    let dateObject = viewedMonth;
    let lastDay = moment(dateObject)
      .add(1, "months")
      .endOf("month")
      .format(format);
    return lastDay;
  };
  const lastDayOfMonth = () => {
    let dateObject = viewedMonth;
    let lastDay = moment(dateObject).endOf("month").format("D");
    return lastDay;
  };
  if (viewedMonth.format("d") !== "0") {
    let lastDay = previousMonthFormat("D");
    let lastMonth = previousMonthFormat("MMM");
    let lastYear = previousMonthFormat("YYYY");
    let firstDay = parseInt(viewedMonth.format("D"));
    for (let x = 0; x < firstDay; x++) {
      let getDay = parseInt(lastDay) - (firstDay - x) + 1;
      monthDays.push(divWrapper(`${lastMonth}-${getDay}-${lastYear}`));
    }
  }
  let currentMonthString = currentMonthFormat("MMM");
  let currentYearString = currentMonthFormat("YYYY");
  for (let x = 1; x <= parseInt(lastDayOfMonth()); x++) {
    monthDays.push(
      divWrapper(`${currentMonthString}-${x}-${currentYearString}`)
    );
  }
  let endDayPadder = 1;
  let nextMonthString = nextMonthFormat("MMM");
  let nextYearString = nextMonthFormat("YYYY");
  let limit = monthDays.length > 35 ? 42 : 35;
  while (monthDays.length < limit) {
    monthDays.push(
      divWrapper(`${nextMonthString}-${endDayPadder}-${nextYearString}`)
    );
    endDayPadder++;
  }
  let rows = [];
  let cells = [];
  monthDays.forEach((element, i) => {
    cells.push(element);
    if ((i + 1) % 7 === 0) {
      rows.push(cells);
      cells = [];
    }
  });
  return (
    <div id="monthGridContainer">
      <div id="weekDayHeader">{bruh}</div>
      <div id="daysGrid">
        {rows.map((row) => (
          <div id="gridrow">{row}</div>
        ))}
      </div>
    </div>
  );
}

export default MonthGrid;
