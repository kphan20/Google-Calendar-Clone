import logo from "./logo.svg";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";
import React, { useState } from "react";
import moment from "moment";
import MonthCalendar from "./components/MonthCalendar";

function App() {
  const [sidebarOpen, sidebarToggle] = useState(true);

  function sidebarOnClick() {
    sidebarToggle(!sidebarOpen);
  }

  const [displayOption, displayToggle] = useState("Day");

  const displaySelect = (e) => {
    displayToggle(e.target.value);
  };

  const [selectedDay, changeSelectedDay] = useState(moment());

  function chooseDisplay() {
    switch (displayOption) {
      case "Day":
        return "Day";
      case "Month":
        return "Month";
      case "Year":
        let months = moment.months();
        let yearMonths = [];
        let currentYear = selectedDay.format("YYYY");
        //let year = selectedDay.format
        months.forEach((month) => {
          yearMonths.push(
            <div class="yearMonths" key={month}>
              <MonthCalendar
                sidebar={false}
                day={moment(month + currentYear)}
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
  console.log(selectedDay.format("YYYY"));
  console.log(selectedDay);
  return (
    <div className="App">
      <Header menuButton={sidebarOnClick} displaySelect={displaySelect} />
      <button id="create">Create</button>
      <div class="row1">
        {sidebarOpen && (
          <Sidebar
            monthCalendarDay={selectedDay}
            monthCalendarChange={changeSelectedDay}
          />
        )}
        <div id="big-container">
          <div id="top-left">{selectedDay.format("YYYY")}</div>
          <div id="inner">{bruh}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
