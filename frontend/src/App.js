import logo from "./logo.svg";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";
import React, { useState } from "react";
import moment from "moment";
import MonthCalendar from "./components/MonthCalendar";

function App() {
  const [sidebarOpen, sidebarToggle] = useState(true);

  function onClick() {
    sidebarToggle(!sidebarOpen);
  }

  const [displayOption, displayToggle] = useState("Day");

  const displaySelect = (e) => {
    displayToggle(e.target.value);
  };
  function chooseDisplay() {
    switch (displayOption) {
      case "Day":
        return "Day";
      case "Month":
        return "Month";
      case "Year":
        let months = moment.months();
        let yearMonths = [];
        months.forEach((month) => {
          yearMonths.push(
            <div class="yearMonths">
              <MonthCalendar sidebar={false} />
            </div>
          );
        });
        return yearMonths;
      default:
        return;
    }
  }
  let bruh = chooseDisplay();
  return (
    <div className="App">
      <Header menuButton={onClick} displaySelect={displaySelect} />
      <button id="create">Create</button>
      <div class="row1">
        {sidebarOpen && <Sidebar />}
        <div id="big-container">
          <div id="top-left"></div>
          <div id="inner">{bruh}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
