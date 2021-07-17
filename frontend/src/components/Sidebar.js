import React from "react";
import "./Sidebar.css";
import "./CalendarsButton";
import CalendarsButton from "./CalendarsButton";
import MonthCalendar from "./MonthCalendar";

function Sidebar(props) {
  return (
    <>
      <div id="button-space"></div>
      <div id="sidebar">
        <div id="sidebar-calendar">
          <MonthCalendar
            sidebar={true}
            day={props.monthCalendarDay}
            changeSelectedDay={props.monthCalendarChange}
            viewDay={props.viewDay}
            changeView={props.monthCalendarViewChange}
          />
        </div>
        <div id="my-calendars">
          <CalendarsButton name="My calendars" />
        </div>
        <div id="other-calendars">
          <CalendarsButton name="Other calendars" />
        </div>
      </div>
    </>
  );
}

export default Sidebar;
