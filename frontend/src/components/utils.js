import moment from "moment";
import axios from "axios";

// Used to prepend API calls
export const apiLink = "http://127.0.0.1:8000/";
/**
 * Retrieves calendars and contained events from database
 * @param  {Object}     authInfo        State that holds login information (username and token)
 * @param  {function}   updateCalendars Holds organized data from database
 * @return {void}
 */
export function getCalendars(authInfo, updateCalendars) {
  // Prepares configuration for GET request
  const config = {
    params: {
      username: authInfo["username"],
    },
    headers: {
      Authorization: `Token ${authInfo["token"]}`,
    },
  };
  // Sends request through axios
  axios.get(apiLink + "get-calendars/", config).then(
    (response) => {
      //console.log(response);
      for (const group in response.data) {
        const calendars = response.data[group];
        for (const calendar in calendars) {
          // Sets default visibility of calendars to true; can be toggled by user
          response.data[group][calendar]["visibility"] = true;
          // Generates random color for calendar events
          let color = Math.floor(Math.random() * 16777215).toString(16);
          if (color.length < 6) {
            color = "f".concat(color);
          }
          response.data[group][calendar]["color"] = color;
        }
      }
      updateCalendars(response.data);
    },
    (error) => {
      console.log(error);
    }
  );
}
/**
 * Organizes events by date
 * @param  {Obj} calendars Contains all retrieved calendars and events
 * @param  {Obj} eventList Object that will be populated with Date : [events] key-value pairs
 * @return {void}
 */
export function extractEvents(calendars, eventList) {
  const calendarList = Object.keys(calendars);
  calendarList.forEach((calendar) => {
    const currentCalendar = calendars[calendar];
    if (currentCalendar["visibility"]) {
      const calendarID = calendar.split("\\")[0];
      const events = Object.values(currentCalendar);
      events.forEach((eventItem) => {
        // filters out visibility and color values stored in calendar key
        if (typeof eventItem !== "boolean" && typeof eventItem !== "string") {
          const formattedDate = moment
            .utc(eventItem["start_date"])
            .format("MMM-D-YYYY");
          eventItem["color"] = currentCalendar["color"];
          eventItem["calendarID"] = calendarID;
          // creates key-value pair for the specified date if not already existing
          if (eventList[formattedDate]) {
            eventList[formattedDate].push(eventItem);
          } else {
            eventList[formattedDate] = [eventItem];
          }
        }
      });
    }
  });
}
/**
 * Sorts events by start time ascending, then end time descending
 * @param  {Obj} eventList List of events to be sorted; events all start on the same day
 * @return {Array}         Sorted array of events
 */
export function sortEvents(eventList) {
  /**
   * Implementation of merge sort for event objects
   * @param  {Array}  left     left array
   * @param  {Array}  right    right array
   * @param  {String} dateType Used to signal the correct comparison function
   * @return {Array}           Sorted array
   */
  const merge = (left, right, dateType) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    /**
     * Comparison function that changes based on dateType
     * @param  {Moment obj} date1 first date
     * @param  {Moment obj} date2 second date
     * @return {Boolean}          desired boolean result of comparison
     */
    let compare = (date1, date2) => {
      return date1.isBefore(date2);
    };
    if (dateType === "end_date") {
      compare = (date1, date2) => {
        return date1.isAfter(date2);
      };
    }
    while (leftIndex < left.length && rightIndex < right.length) {
      if (
        compare(
          moment(left[leftIndex][dateType]),
          moment(right[rightIndex][dateType])
        )
      ) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }
    result =
      leftIndex === left.length
        ? result.concat(right.slice(rightIndex))
        : result.concat(left.slice(leftIndex));
    return result;
  };
  /**
   * Initiates recursive mergesort algorithm
   * @param  {Array}  arr      Event array
   * @param  {String} dateType Used in merge sort algorithm
   * @return {Array}           Sorted array
   */
  const mergeSort = (arr, dateType) => {
    if (arr.length === 1 || arr.length === 0) {
      return arr;
    }
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(
      mergeSort(left, dateType),
      mergeSort(right, dateType),
      dateType
    );
  };

  // Sorts by start_date ascending, then end_date descending
  let firstSort = mergeSort(eventList, "start_date");
  let endDateSorted = [];
  let limit = firstSort.length;
  for (let i = 0; i < limit; i++) {
    let endDateSorter = [firstSort[i]];
    // Collects all dates that start at the same time to ensure start_date ascending order is preserved
    while (i < limit - 1) {
      if (
        moment(firstSort[i]["start_date"]).isSame(
          firstSort[i + 1]["start_date"]
        )
      ) {
        endDateSorter.push(firstSort[i + 1]);
        i++;
      } else {
        break;
      }
    }
    endDateSorted = endDateSorted.concat(mergeSort(endDateSorter, "end_date"));
  }
  return endDateSorted;
}

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
