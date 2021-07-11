import React from "react";
import "./Header.css";
import moment from "moment";

function Header(props) {
  let day = moment().format("D");
  let src = `//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${day}_2x.png#`;
  let srcset = `//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${day}_2x.png 2x ,//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${day}_2x.png# 1x`;
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
              src={src}
              srcSet={srcset}
              alt=""
              aria-hidden="true"
              width="40px"
              height="40px"
            ></img>
          </div>
          <div
            class="column"
            id="Calendar-header"
            style={{ textDecoration: "none" }}
          >
            Calendar
          </div>
        </div>
        <div class="row">
          <button id="today-button" onClick={props.todayButtonClick}>
            Today
          </button>
          <button id="previous-button">&lt;</button>
          <button id="next-button">&gt;</button>
          <button id="month-selector">{props.headerMessage}</button>
        </div>
        <div class="row" id="top-right">
          <div>bruh</div>
          <div>bruh</div>
          <select
            id="dropdown"
            name="Filler v"
            onChange={props.displaySelect}
            defaultValue="Day"
          >
            <option value="Day">Day</option>
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
