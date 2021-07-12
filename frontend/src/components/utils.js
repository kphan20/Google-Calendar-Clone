import moment from "moment";
/**
 * Generates array that contains row arrays, which contain the "day" html elements that compose the month calendar
 * @param  {Moment obj} viewedMonth   Gives current date that contains current month
 * @param  {function}   divWrapper    Creates required "day" html representation
 * @param  {function}   calendarClick Provides onClick action for day elements
 * @param  {function}   maxSize       Provides desired month calendar size
 * @return {Array}                    2D array that contains calendar representation (each week is a row)
 */
export function generateCalendar(
  viewedMonth,
  divWrapper,
  calendarClick,
  maxSize
) {
  // Used to collect all days in the month
  let monthDays = [];

  /**
   * Returns string with numeric representation of the day of the week of the first day (ex. Monday = 1)
   * @return {String} String with number in range of 0-6 (Sunday - Saturday)
   */
  const firstDayOfMonth = () => {
    let dateObject = viewedMonth;
    let firstDay = moment(dateObject).startOf("month").format("d");
    return firstDay;
  };

  /**
   * Returns desired string representation of month before viewedMonth
   * (https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/)
   * @param  {String} format Desired format of date string representation
   * @return {String}        String representation of previous month
   */
  const previousMonthFormat = (format) => {
    let dateObject = viewedMonth;
    let lastDay = moment(dateObject)
      .subtract(1, "months")
      .endOf("month")
      .format(format);
    return lastDay;
  };

  /**
   * Returns desired string representation of viewedMonth
   * @param  {String} format Desired format of date string representation
   * @return {String}        String representation of viewedMonth
   */
  const currentMonthFormat = (format) => {
    let dateObject = viewedMonth;
    return moment(dateObject).format(format);
  };

  /**
   * Returns desired string representation of month after viewedMonth
   * @param  {String} format Desired format of date string representation
   * @return {String}        String representation of next month
   */
  const nextMonthFormat = (format) => {
    let dateObject = viewedMonth;
    let lastDay = moment(dateObject)
      .add(1, "months")
      .endOf("month")
      .format(format);
    return lastDay;
  };

  /**
   * Returns string representation of last day in viewedMonth
   * @return {String}        String representation of last day
   */
  const lastDayOfMonth = () => {
    let dateObject = viewedMonth;
    let lastDay = moment(dateObject).endOf("month").format("D");
    return lastDay;
  };

  let firstDay = parseInt(firstDayOfMonth());

  // Pads monthDays array with previous month's days if current month doesn't start on a Sunday
  if (firstDay !== 0) {
    let lastDay = previousMonthFormat("D");
    let lastMonth = previousMonthFormat("MMM");
    let lastYear = previousMonthFormat("YYYY");
    for (let x = 0; x < firstDay; x++) {
      let getDay = parseInt(lastDay) - (firstDay - x) + 1;
      monthDays.push(
        divWrapper(
          `${lastMonth}-${getDay}-${lastYear}`,
          getDay,
          "notCurrentMonth",
          calendarClick
        )
      );
    }
  }

  // Adds current month's days to monthDays
  let currentMonthString = currentMonthFormat("MMM");
  let currentYearString = currentMonthFormat("YYYY");
  for (let x = 1; x <= parseInt(lastDayOfMonth()); x++) {
    monthDays.push(
      divWrapper(
        `${currentMonthString}-${x}-${currentYearString}`,
        x,
        "currentMonth",
        calendarClick
      )
    );
  }

  // Adds next month's days to monthDays until size by maxSize() is reached
  let endDayPadder = 1;
  let nextMonthString = nextMonthFormat("MMM");
  let nextYearString = nextMonthFormat("YYYY");
  let limit = maxSize(monthDays);
  while (monthDays.length < limit) {
    monthDays.push(
      divWrapper(
        `${nextMonthString}-${endDayPadder}-${nextYearString}`,
        endDayPadder,
        "notCurrentMonth",
        calendarClick
      )
    );
    endDayPadder++;
  }

  // Creates arrays for each week
  let rows = [];
  let cells = [];
  monthDays.forEach((element, i) => {
    cells.push(element);
    if ((i + 1) % 7 === 0) {
      rows.push(cells);
      cells = [];
    }
  });
  return rows;
}
