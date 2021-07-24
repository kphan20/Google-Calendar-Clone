import React from "react";
import "./Header.css";
import moment from "moment";
import { Link } from "react-router-dom";

function Header(props) {
  let day = moment().format("D");
  let src = `//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${day}_2x.png#`;
  let srcset = `//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${day}_2x.png 2x ,//ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_${day}_2x.png# 1x`;
  const logOut = () => {
    props.setAuthInfo({});
    props.updateCalendars({});
  };
  const displaySelect = (e) => {
    props.displayToggle(e.target.value);
  };
  let loginButton = props.username ? (
    <>
      <p>Welcome {props.username}!</p>
      <button type="button" onClick={logOut}>
        Logout
      </button>
    </>
  ) : (
    <Link to="/login">
      <button type="button">Login</button>
    </Link>
  );
  return (
    <header role="banner">
      <div id="headercontainer">
        <div className="section">
          <div className="column" id="menu-button">
            <button id="menu-toggle" onClick={props.menuButton}>
              <img
                src="https://pics.freeicons.io/uploads/icons/png/15211315791553239378-512.png"
                alt=""
                width="50"
                height="50"
              ></img>
            </button>
          </div>
          <div className="column" id="logo">
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
            className="column"
            id="Calendar-header"
            style={{ textDecoration: "none" }}
          >
            Calendar
          </div>
        </div>
        <div className="section">
          <button id="today-button" onClick={props.todayButtonClick}>
            Today
          </button>
          <button id="previous-button" onClick={props.backClick}>
            &lt;
          </button>
          <button id="next-button" onClick={props.forwardClick}>
            &gt;
          </button>
          <button id="month-selector">{props.headerMessage}</button>
        </div>
        <div className="section" id="top-right">
          <div> </div>
          <select
            id="dropdown"
            name="Filler v"
            onChange={displaySelect}
            value={props.changeDisplayValue}
          >
            <option value="Day">Day</option>
            <option value="Month">Month</option>
            <option value="Year">Year</option>
          </select>
          <div>{loginButton}</div>
        </div>
        <hr id="headerline"></hr>
      </div>
    </header>
  );
}

export default Header;
