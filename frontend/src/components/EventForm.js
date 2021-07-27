import React, { useState, useEffect } from "react";
import MonthCalendar from "./MonthCalendar";
import moment from "moment";
import axios from "axios";
import "./EventForm.css";
import { apiLink, getCalendars } from "./utils";

const apiEndpoints = {
  post: "event-create/",
  put: "edit-event/",
};
function EventForm(props) {
  const [eventTitle, changeTitle] = useState("");
  const [eventStartDate, changeStartDate] = useState(moment(props.selectedDay));
  const [eventEndDate, changeEndDate] = useState(
    props.endDate
      ? moment(props.endDate)
      : moment(eventStartDate).add(1, "hour")
  );
  const [description, changeDescription] = useState("");
  const [formViewStartDay, changeStartView] = useState(moment(eventStartDate));
  const [formViewEndDay, changeEndView] = useState(moment(eventEndDate));
  const [startTimeMeridiem, updateStartMeridiem] = useState(
    eventStartDate.format("a")
  );
  const [endTimeMeridiem, updateEndMeridiem] = useState(
    eventEndDate.format("a")
  );
  const startBeforeEndCheck = (newStartDate) => {
    if (!newStartDate.isBefore(eventEndDate)) {
      changeEndDate(moment(newStartDate).add(1, "hour"));
    }
  };
  const handleChange = (changeFunction) => (e) => {
    changeFunction(e.target.value);
  };
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
  // let dropDownOptions = (() => {
  //   const calendarNames = {};
  //   const ownCalendars = props.calendars["own_calendars"];
  //   for (const calendar in ownCalendars) {
  //     const parsedCalendar = calendar.split("\\");
  //     calendarNames[parsedCalendar[1]] = parsedCalendar[0];
  //   }
  //   return calendarNames;
  // })();
  let dropDownOptions = props.dropDownOptions;
  const [calendarID, changeCalendar] = useState(
    props.calendar || Object.values(dropDownOptions)[0]
  );
  const dropDownSelector = (e) => {
    console.log(e.target.value);
    changeCalendar(e.target.value);
  };
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
          console.log("enter valid value");
        }
      } catch (error) {}
    };
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
      console.log(data);
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
            console.log(response);
          },
          (error) => {
            console.log("event creation failed");
            console.log(error);
          }
        )
        .then(() => {
          props.changeContent(null);
          getCalendars(props.authInfo, props.updateCalendars);
        });
    }
  };
  const [isValidEndDate, validEndDateToggle] = useState(true);
  const [startHours, changeStartHours] = useState();
  const [startMins, changeStartMins] = useState();
  const [endHours, changeEndHours] = useState();
  const [endMins, changeEndmins] = useState(eventEndDate.format("mm"));
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

  const handleTimeFieldChanges = (changeFunc) => (e) => {
    changeFunc(e.target.value);
  };
  const styleTag = `
  #startCalendar #${eventStartDate.format(
    "MMM-D-YYYY"
  )}.select{background-color: #d2e3fc;}
  #endCalendar #${eventEndDate.format(
    "MMM-D-YYYY"
  )}.select{background-color: #d2e3fc;}`;
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
