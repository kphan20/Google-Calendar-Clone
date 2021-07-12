import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";
import React, { useState } from "react";
import moment from "moment";
import MonthCalendar from "./components/MonthCalendar";
import MonthGrid from "./components/MonthGrid";

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
  const [viewedDay, changeViewedDay] = useState(moment());
  const today = moment().format("MMM-D-YYYY");
  const todayButtonClick = () => {
    changeSelectedDay(moment());
    changeViewedDay(moment());
  };

  let headerMessage = "";
  let backClick = () => {};
  let forwardClick = () => {};
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
        return <MonthGrid viewedDay={selectedDay} />;
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
            <div class="yearMonths" key={month}>
              <MonthCalendar
                sidebar={false}
                viewDay={moment(month + currentYear)}
                day={selectedDay}
                changeView={changeViewedDay}
                changeDay={changeSelectedDay}
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
  return (
    <div className="App">
      <Header
        menuButton={sidebarOnClick}
        displaySelect={displaySelect}
        headerMessage={headerMessage}
        todayButtonClick={todayButtonClick}
        backClick={backClick}
        forwardClick={forwardClick}
        changeDisplayDefault={displayOption}
      />
      <button id="create">Create</button>
      <div class="row1">
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
  );
}

export default App;
