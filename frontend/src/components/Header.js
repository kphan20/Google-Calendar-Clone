import React, { useState } from "react";
import "./Header.css";

function Header(props) {
  return (
    <header role="banner">
      <div id="headercontainer">
        <div class="row">
          <div class="column" id="menu-button">
            <button id="menu-toggle" onClick={props.menuButton}>
              <img
                src="./Hamburger_icon.svg.png"
                alt=""
                width="50"
                height="50"
              ></img>
            </button>
          </div>
          <div class="column" id="logo">
            <img
              class="gb_tc gb_6d"
              src="//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_9_2x.png#"
              srcset="//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_9_2x.png 2x ,//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_9_2x.png# 1x"
              alt=""
              aria-hidden="true"
              width="40px"
              height="40px"
            ></img>
          </div>
          <div
            class="column"
            id="Calendar-header"
            style={{ "text-decoration": "none" }}
          >
            Calendar
          </div>
        </div>
        <div class="row">
          <button id="today-button">Today</button>
          <button id="previous-button">&lt;</button>
          <button id="next-button">&gt;</button>
          <button id="month-selector">July 2021</button>
        </div>
        <div class="row" id="top-right">
          <div>bruh</div>
          <div>bruh</div>
          <select id="dropdown" name="Filler v" onChange={props.displaySelect}>
            <option selected value="Day">
              Day
            </option>
            <option value="Month">Month</option>
            <option value="Year">Year</option>
          </select>
          <div>bruh</div>
        </div>
        <hr id="headerline"></hr>
      </div>
    </header>
  );
}

export default Header;
