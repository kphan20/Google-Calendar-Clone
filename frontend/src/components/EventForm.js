import React, { useState, useEffect } from "react";
import MonthCalendar from "./MonthCalendar";
import moment from "moment";
import axios from "axios";
import "./EventForm.css";
import { apiLink, getCalendars } from "./utils";

// Used for axios requests
const apiEndpoints = {
  post: "event-create/",
  put: "edit-event/",
};

/**
 * Represents event creation form
 * @component
 * @param  {Obj} props   selectedDay, endDate, dropDownOptions, calendar, authInfo, request, eventID, changeContent, updateCalendars, toggleFormFlag
 * @return {JSX Element}
 */
function EventForm(props) {
  const [eventTitle, changeTitle] = useState(""); // Controls title input box
  const [eventStartDate, changeStartDate] = useState(moment(props.selectedDay)); // Stores start date for request
  const [eventEndDate, changeEndDate] = useState(
    props.endDate
      ? moment(props.endDate)
      : moment(eventStartDate).add(1, "hour")
  ); // Stores end date for request; default is 1 hour after start date
  const [description, changeDescription] = useState(""); // Controls description input box
  // Controls view day for start day selection (there is a month calendar to choose dates on)
  const [formViewStartDay, changeStartView] = useState(moment(eventStartDate));
  const [formViewEndDay, changeEndView] = useState(moment(eventEndDate)); // Controls view day for end day selection
  // Controls am/pm display for start date on form
  const [startTimeMeridiem, updateStartMeridiem] = useState(
    eventStartDate.format("a")
  );
  // Controls am/pm display for end date on form
  const [endTimeMeridiem, updateEndMeridiem] = useState(
    eventEndDate.format("a")
  );
  const [isValidEndDate, validEndDateToggle] = useState(true); // Used to check if end date is after start and frontend validation

  // Controls time entry fields in form
  const [startHours, changeStartHours] = useState();
  const [startMins, changeStartMins] = useState();
  const [endHours, changeEndHours] = useState();
  const [endMins, changeEndmins] = useState(eventEndDate.format("mm"));

  /**
   * Sets end date to 1 hour after start date if end date < start date
   * @param  {Moment obj} newStartDate  Moment object representing changed start date
   * @return {void}
   */
  const startBeforeEndCheck = (newStartDate) => {
    if (!newStartDate.isBefore(eventEndDate)) {
      changeEndDate(moment(newStartDate).add(1, "hour"));
    }
  };

  /**
   * Controls title and description form fields
   * @param  {Function} changeFunction  Relevant state change function
   * @return {Function} Curried function that changes state based on event
   */
  const handleChange = (changeFunction) => (e) => {
    changeFunction(e.target.value);
  };
  /**
   * Handles clicks on start date month calendar
   * @param  {Event} e  click event
   * @return {void}
   */
  const calendarClickStartDate = (e) => {
    let date = e.target.id;
    let hour = parseInt(eventStartDate.format("h"));
    let minutes = parseInt(eventStartDate.format("m"));
    let timeSet = { hour: hour, minute: minutes };
    let newStartDate = moment(date).set(timeSet);
    changeStartDate(newStartDate);
    startBeforeEndCheck(newStartDate);
    changeStartView(newStartDate);
  };
  /**
   * Handles clicks on end date month calendar
   * @param  {Event} e  click event
   * @return {void}
   */
  const calendarClickEndDate = (e) => {
    let date = e.target.id;
    let hour = parseInt(eventEndDate.format("h"));
    let minutes = parseInt(eventEndDate.format("m"));
    let timeSet = { hour: hour, minute: minutes };
    let newEndDate = moment(date).set(timeSet);
    changeEndDate(newEndDate);
    changeEndView(newEndDate);
    if (!newEndDate.isAfter(eventStartDate)) {
      console.error("enter valid end time");
    }
  };

  const dropDownOptions = props.dropDownOptions;
  // Stores calendar_id for request
  const [calendarID, changeCalendar] = useState(
    props.calendar || Object.values(dropDownOptions)[0]
  );

  // Changes calendarID state depending on calendar dropdown selection
  const dropDownSelector = (e) => {
    changeCalendar(e.target.value);
  };
  /**
   * Changes start/end date based on entries in time based fields
   * @param  {Number}   maxValue        Max value for hours/minutes
   * @param  {String}   inputType       String used to determine which time field was changed
   * @param  {Function} changeFunction  State change function for start/end date
   * @param  {Function} compareFunction for startBeforeEndCheck function input
   * @return {Function}                 Curried function that uses event values
   */
  const timeEnter =
    (maxValue, inputType, changeFunction, compareFunction) => (e) => {
      try {
        let value = parseInt(e.target.value);
        if (value >= 0 && value <= maxValue) {
          changeFunction((previousState) => {
            let setType =
              inputType === "hour" ? { hour: value } : { minutes: value };
            let newStartDate = moment(previousState).set(setType);
            if (compareFunction) {
              compareFunction(newStartDate);
            }
            return newStartDate;
          });
        } else {
          // Practically useless due to html field validation
          // Will keep in case I want to update behavior
          console.log("enter valid value");
        }
      } catch (error) {}
    };

  // Used for form submit button
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidEndDate) {
      const data = {
        title: eventTitle,
        start_date: moment(eventStartDate).format("YYYY-MM-DDTHH:mm:ss"),
        end_date: moment(eventEndDate).format("YYYY-MM-DDTHH:mm:ss"),
        desc: description,
        calendar_id: calendarID,
      };
      //console.log(data);
      const headers = {
        Authorization: `Token ${props.authInfo["token"]}`,
      };
      axios({
        method: props.request,
        url: `${apiLink}${apiEndpoints[props.request]}${props.eventID || ""}`,
        data: data,
        headers: headers,
      })
        .then(
          (response) => {
            //console.log(response);
          },
          (error) => {
            console.log("event creation failed");
            console.log(error);
          }
        )
        .then(() => {
          // Closes form and retrieves calendars
          props.changeContent(null);
          getCalendars(props.authInfo, props.updateCalendars);
        });
    }
  };

  // Updates relevant states after any changes in start/end date
  useEffect(() => {
    validEndDateToggle(eventEndDate.isAfter(eventStartDate));
    changeStartHours(eventStartDate.format("h"));
    changeStartMins(eventStartDate.format("mm"));
    changeEndHours(eventEndDate.format("h"));
    changeEndmins(eventEndDate.format("mm"));
    updateStartMeridiem(eventStartDate.format("a"));
    updateEndMeridiem(eventEndDate.format("a"));
  }, [eventEndDate, eventStartDate]);
  let endDateStyle = {
    backgroundColor: isValidEndDate ? "white" : "red",
  };

  // Updates fields related to time on form
  const handleTimeFieldChanges = (changeFunc) => (e) => {
    changeFunc(e.target.value);
  };

  // Colors calendars on form
  const styleTag = `
  #startCalendar #${eventStartDate.format(
    "MMM-D-YYYY"
  )}.select{background-color: #d2e3fc;}
  #endCalendar #${eventEndDate.format(
    "MMM-D-YYYY"
  )}.select{background-color: #d2e3fc;}`;

  /**
   * Handles changes to am/pm selection on form
   * @param  {Function} meridiemChangeFunc changes am/pm form fields
   * @param  {Function} dateChangeFunc     used to adjust start/end time based on user selection
   * @return {void}
   */
  const changeMeridiem = (meridiemChangeFunc, dateChangeFunc) => (e) => {
    const value = e.target.value;
    meridiemChangeFunc(value);
    dateChangeFunc((previousState) => {
      let previousHours = parseInt(previousState.format("H"));
      previousHours = value === "am" ? previousHours - 12 : previousHours + 12;
      const newHours = moment(previousState.set({ hour: previousHours }));
      return newHours;
    });
  };
  return (
    <div id="popupBox" className="eventForm">
      <style scoped>{styleTag}</style>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange(changeTitle)}
            maxLength="20"
          />
          <button
            type="button"
            id="x"
            onClick={() => {
              props.changeContent();
              props.toggleFormFlag(false);
            }}
          >
            x
          </button>
        </div>
        <br />
        <label>Select start date:</label>
        <div id="startCalendar">
          <MonthCalendar
            sidebar={true}
            viewedDay={formViewStartDay}
            changeView={changeStartView}
            calendarClick={calendarClickStartDate}
          />
        </div>
        <input
          className="timefield"
          dir="rtl"
          type="number"
          max="23"
          value={startHours}
          onChange={handleTimeFieldChanges(changeStartHours)}
          onBlur={timeEnter(24, "hour", changeStartDate, startBeforeEndCheck)}
        />
        <label>:</label>
        <input
          className="timefield"
          type="number"
          max="59"
          value={startMins}
          onChange={handleTimeFieldChanges(changeStartMins)}
          onBlur={timeEnter(
            59,
            "minutes",
            changeStartDate,
            startBeforeEndCheck
          )}
        />
        <select
          value={startTimeMeridiem}
          onChange={changeMeridiem(updateStartMeridiem, changeStartDate)}
        >
          <option value="am">am</option>
          <option value="pm">pm</option>
        </select>
        <br />
        <label>From: {eventStartDate.format("MMMM D, YYYY h:mm a")}</label>
        <br />
        <label>Select end date:</label>
        <div id="endCalendar">
          <MonthCalendar
            sidebar={true}
            viewedDay={formViewEndDay}
            changeView={changeEndView}
            calendarClick={calendarClickEndDate}
          />
        </div>
        <input
          dir="rtl"
          type="number"
          max="23"
          style={endDateStyle}
          className="timefield"
          value={endHours}
          onChange={handleTimeFieldChanges(changeEndHours)}
          onBlur={timeEnter(24, "hour", changeEndDate)}
        />
        <label>:</label>
        <input
          type="number"
          max="59"
          style={endDateStyle}
          className="timefield"
          value={endMins}
          onChange={handleTimeFieldChanges(changeEndmins)}
          onBlur={timeEnter(59, "minutes", changeEndDate)}
        />
        <select
          value={endTimeMeridiem}
          onChange={changeMeridiem(updateEndMeridiem, changeEndDate)}
        >
          <option value="am">am</option>
          <option value="pm">pm</option>
        </select>
        {!isValidEndDate && <label>End date must be before start.</label>}
        <br />
        <label>Until: {eventEndDate.format("MMMM D, YYYY h:mm a")}</label>
        <textarea
          rows="3"
          cols="38"
          maxLength="200"
          name="description"
          placeholder="Description"
          onChange={handleChange(changeDescription)}
          id="desc"
        />
        <br />
        <select id="dropdown" onChange={dropDownSelector}>
          {Object.keys(dropDownOptions).map((calendarName) => (
            <option value={dropDownOptions[calendarName]}>
              {calendarName}
            </option>
          ))}
        </select>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default EventForm;
