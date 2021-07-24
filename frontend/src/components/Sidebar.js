import React from "react";
import "./Sidebar.css";
import "./CalendarsButton";
import CalendarsButton from "./CalendarsButton";
import MonthCalendar from "./MonthCalendar";
import moment from "moment";

/**
 * Represents page sidebar
 * @component
 * @param  {Obj} props calendars, changeSelectedDay, changeView, updateCalendars, viewedDay
 * @return {JSX Element}   Sidebar
 */
function Sidebar(props) {
  /**
   * Defines onClick behavior for dates on the sidebar calendar
   * @param  {Event} e Click event
   * @return {void}
   */
  const calendarClick = (e) => {
    let date = e.target.id;
    props.changeSelectedDay(moment(date));
    props.changeView(moment(date));
  };
  return (
    <>
      <div id="button-space"></div>
      <div id="sidebar">
        <div id="sidebar-calendar">
          <MonthCalendar
            sidebar={true}
            changeSelectedDay={props.changeSelectedDay}
            viewedDay={props.viewedDay}
            changeView={props.changeView}
            calendarClick={calendarClick}
          />
        </div>
        <div id="my-calendars">
          <CalendarsButton
            name="My calendars"
            group="own_calendars"
            updateCalendars={props.updateCalendars}
            calendars={props.calendars}
          />
        </div>
        <div id="other-calendars">
          <CalendarsButton
            name="Other calendars"
            group="subscribed_calendars"
            updateCalendars={props.updateCalendars}
            calendars={props.calendars}
          />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
