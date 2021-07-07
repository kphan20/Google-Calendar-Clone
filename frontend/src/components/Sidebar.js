import React from "react";
import "./Sidebar.css";
import "./CalendarsButton";
import CalendarsButton from "./CalendarsButton";

function Sidebar(props) {
  return (
    <div id="sidebar">
      <div id="button-space"></div>
      <div id="sidebar-calendar"></div>
      <div id="my-calendars">
        <CalendarsButton name="My calendars" />
      </div>
      <div id="other-calendars">
        <CalendarsButton name="Other calendars" />
      </div>
    </div>
  );
}

export default Sidebar;
