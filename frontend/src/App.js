import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";
import React, { useState } from "react";
import moment from "moment";
import MonthCalendar from "./components/MonthCalendar";
import MonthGrid from "./components/MonthGrid";
import Popup from "./components/Popup";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

function App() {
  let testingDates = { "Jul-8-2021": ["bruh", "no"] };
  const [sidebarOpen, sidebarToggle] = useState(true);

  function sidebarOnClick() {
    sidebarToggle(!sidebarOpen);
  }

  const [displayOption, displayToggle] = useState("Day");

  const displaySelect = (e) => {
    displayToggle(e.target.value);
  };

  const [selectedDay, changeSelectedDay] = useState(moment());
  const [viewedDay, changeViewedDay] = useState(moment());
  const today = moment().format("MMM-D-YYYY");
  const todayButtonClick = () => {
    changeSelectedDay(moment());
    changeViewedDay(moment());
  };

  let headerMessage = "";
  let backClick = () => {};
  let forwardClick = () => {};
  const [popUpContent, changeContent] = useState(<div></div>);
  const [popUpCoordinates, changeCoordinates] = useState({ x: 0, y: 0 });
  function chooseDisplay() {
    switch (displayOption) {
      case "Day":
        headerMessage = selectedDay.format("MMMM D, YYYY");
        backClick = () => {
          changeSelectedDay(moment(selectedDay.subtract(1, "day")));
          changeViewedDay(moment(selectedDay));
        };
        forwardClick = () => {
          changeSelectedDay(moment(selectedDay.add(1, "day")));
          changeViewedDay(moment(selectedDay));
        };
        return "Day";
      case "Month":
        headerMessage = selectedDay.format("MMMM YYYY");
        backClick = () => {
          changeSelectedDay(
            moment(selectedDay.subtract(1, "month").startOf("month"))
          );
          changeViewedDay(moment(selectedDay));
        };
        forwardClick = () => {
          changeSelectedDay(
            moment(selectedDay.add(1, "month").startOf("month"))
          );
          changeViewedDay(moment(selectedDay));
        };
        return (
          <MonthGrid
            viewedDay={selectedDay}
            displayToggle={displayToggle}
            changeSelectedDay={changeSelectedDay}
            changeViewedDay={changeViewedDay}
          />
        );
      case "Year":
        headerMessage = selectedDay.format("YYYY");
        backClick = () => {
          changeSelectedDay(moment(selectedDay.subtract(1, "year")));
          changeViewedDay(moment(selectedDay));
        };
        forwardClick = () => {
          changeSelectedDay(moment(selectedDay.add(1, "year")));
          changeViewedDay(moment(selectedDay));
        };
        let months = moment.months();
        let yearMonths = [];
        let currentYear = selectedDay.format("YYYY");
        //let year = selectedDay.format
        months.forEach((month) => {
          yearMonths.push(
            <div className="yearMonths" key={month}>
              <MonthCalendar
                sidebar={false}
                viewDay={moment(month + currentYear)}
                day={selectedDay}
                changeView={changeViewedDay}
                changeSelectedDay={changeSelectedDay}
                changeContent={changeContent}
                changeCoordinates={changeCoordinates}
                testingDates={testingDates}
              />
            </div>
          );
        });
        return yearMonths;
      default:
        return;
    }
  }
  let bruh = chooseDisplay();
  let margin = sidebarOpen ? "auto" : "60px";
  let bigContainerStyle = {
    marginLeft: margin,
    minWidth: "775px",
  };
  let mainSelectedDay = selectedDay.format("MMM-D-YYYY");
  let styleTag = `
  div#${mainSelectedDay}.currentMonth{
    background-color: #d2e3fc;
  }
  div#${today}.currentMonth{
    background-color: #1a73e8;
  }
  `;
  const [authInfo, setAuthInfo] = useState({});
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login setAuthInfo={setAuthInfo} />
        </Route>
        <Route path="/">
          <div className="App">
            {displayOption === "Year" && (
              <div id="pop-up-container">
                <Popup
                  coords={popUpCoordinates}
                  popUpContent={popUpContent}
                  changeContent={changeContent}
                  changeCoordinates={changeCoordinates}
                />
              </div>
            )}
            <Header
              menuButton={sidebarOnClick}
              displaySelect={displaySelect}
              headerMessage={headerMessage}
              todayButtonClick={todayButtonClick}
              backClick={backClick}
              forwardClick={forwardClick}
              changeDisplayValue={displayOption}
              username={authInfo.username}
              setAuthInfo={setAuthInfo}
            />
            <button id="create">Create</button>
            <div className="row1">
              {sidebarOpen && (
                <Sidebar
                  monthCalendarDay={selectedDay}
                  monthCalendarChange={changeSelectedDay}
                  viewDay={viewedDay}
                  monthCalendarViewChange={changeViewedDay}
                />
              )}
              <div id="big-container" style={bigContainerStyle}>
                <div id="inner">{bruh}</div>
                <style scoped>{styleTag}</style>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
