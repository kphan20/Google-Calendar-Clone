import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";
import React, { useState, useEffect } from "react";
import moment from "moment";
import MonthCalendar from "./components/MonthCalendar";
import MonthGrid from "./components/MonthGrid";
import Popup from "./components/Popup";
import Login from "./components/Login";
import EventForm from "./components/EventForm";
import DayDisplay from "./components/DayDisplay";
import { Route, Switch, useHistory } from "react-router-dom";
import { extractEvents, getCalendars } from "./components/utils";

const formTesting = true;

// helper method that is used for formatting event information in the year view
const popUpWrapper = (content) => {
  if (Array.isArray(content)) {
    content = content.map((item) => {
      let time = moment.utc(item.start_date).format("h:mma");
      return <div>{`${time} ${item.title}`}</div>;
    });
  }
  return <div id="popupBox">{content}</div>;
};
function App() {
  const [authInfo, setAuthInfo] = useState({}); // Stores login information and token authentication
  const [calendars, updateCalendars] = useState({}); // Stores calendar information retrieved from database
  const [generatedEventList, updateList] = useState({}); // Sorts events by date eg. { 'Date' : [events] }
  const [formFlag, toggleFormFlag] = useState(false); // Used to handle pop-up behavior with forms
  const [sidebarOpen, sidebarToggle] = useState(true); // Used to control visibility of sidebar
  const [displayOption, displayToggle] = useState("Year"); // Controls display options ("Day", "Month", "Year")
  const [selectedDay, changeSelectedDay] = useState(moment()); // Stores the day that is focused on (denoted by gray circle in UI); default day that is chosen if event creation form is opened
  const [viewedDay, changeViewedDay] = useState(moment()); // Allows for viewing of different months in the sidebar calendar without changing selected day
  const [popUpContent, changeContent] = useState(); // Manages pop-up information (forms, event information)
  const [popUpCoordinates, changeCoordinates] = useState({ x: 0, y: 0 }); // Positions pop-ups
  const [dropDownOptions, setDropDownOptions] = useState([]); // Used as options during event creation; allows for placing events under different calendars
  const history = useHistory(); // Allows for redirects

  // Retrieves calendars upon login
  useEffect(() => {
    getCalendars(authInfo, updateCalendars);
  }, [authInfo]);

  // Extracts useful information after database call
  useEffect(() => {
    updateList(
      (() => {
        let eventList = {};
        if (calendars["own_calendars"]) {
          extractEvents(calendars["own_calendars"], eventList);
          extractEvents(calendars["subscribed_calendars"], eventList);
        }
        return eventList;
      })()
    );
    setDropDownOptions(
      (() => {
        const calendarNames = {};
        const ownCalendars = calendars["own_calendars"];
        for (const calendar in ownCalendars) {
          const parsedCalendar = calendar.split("\\");
          calendarNames[parsedCalendar[1]] = parsedCalendar[0];
        }
        return calendarNames;
      })()
    );
  }, [calendars]);

  // Used as onClick for sidebar toggle button
  function sidebarOnClick() {
    sidebarToggle(!sidebarOpen);
  }

  // Sets selected day to the current day and sets view on that day
  const todayButtonClick = () => {
    changeSelectedDay(moment());
    changeViewedDay(moment());
  };
  const editEventForm = (e) => {
    const attrs = e.target.attributes;
    changeContent(
      <EventForm
        request="put"
        selectedDay={attrs.starttime.value}
        endDate={attrs.end.value}
        calendar={attrs.calendar.value}
        eventID={attrs.eventID.value}
        dropDownOptions={dropDownOptions}
        authInfo={authInfo}
        updateCalendars={updateCalendars}
        changeContent={changeContent}
        toggleFormFlag={toggleFormFlag}
      />
    );
    toggleFormFlag(true);
  };
  const clickEventCreate = (e) => {
    if (!authInfo["token"]) {
      history.push("/login");
    } else {
      const startTime = e.target.title;
      const eventDate = moment(selectedDay).set({
        hour: parseInt(startTime),
        minute: (parseFloat(startTime) % 1) * 60,
      });
      changeContent(
        <EventForm
          request="post"
          selectedDay={eventDate}
          dropDownOptions={dropDownOptions}
          authInfo={authInfo}
          updateCalendars={updateCalendars}
          changeContent={changeContent}
          toggleFormFlag={toggleFormFlag}
        />
      );
      toggleFormFlag(true);
    }
  };
  // Variables that be initialized by chooseDisplay and used in Header component
  let headerMessage;
  let backClick;
  let forwardClick;

  /**
   * Generates UI depending on desired display option
   * @return {JSX Element} Will be displayed after generation
   */
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
        return (
          <DayDisplay
            selectedDay={selectedDay}
            events={generatedEventList}
            changeContent={changeContent}
            dropDownOptions={dropDownOptions}
            authInfo={authInfo}
            toggleFormFlag={toggleFormFlag}
            updateCalendars={updateCalendars}
            history={history}
            eventEdit={editEventForm}
            clickEventCreate={clickEventCreate}
          />
        );
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
        const calendarClick = (e) => {
          let date = e.target.id;
          changeSelectedDay(moment(date));
          changeViewedDay(moment(date));

          if (generatedEventList[date] !== undefined) {
            changeContent(popUpWrapper(generatedEventList[date]));
          } else {
            changeContent(popUpWrapper("No events scheduled"));
          }
          changeCoordinates({ x: e.nativeEvent.x, y: e.nativeEvent.y });
        };
        months.forEach((month) => {
          yearMonths.push(
            <div className="yearMonths" key={month}>
              <MonthCalendar
                sidebar={false}
                viewedDay={moment(month + currentYear)}
                changeView={changeViewedDay}
                calendarClick={calendarClick}
              />
            </div>
          );
        });
        return yearMonths;
      default:
        return;
    }
  }

  const [display, changeDisplay] = useState(chooseDisplay()); // Stores the JSX element(s) that will change on display option change

  // Changes display after another day is selected, display option is changed, login/logout, and if new events are submitted
  useEffect(() => {
    changeDisplay(chooseDisplay());
  }, [
    selectedDay,
    displayOption,
    authInfo,
    calendars,
    generatedEventList,
    //chooseDisplay,
  ]);

  // Style object for html container that is beside the sidebar
  let margin = sidebarOpen ? "auto" : "60px";
  let bigContainerStyle = {
    marginLeft: margin,
    minWidth: "775px",
  };

  // Colors the divs containing the selected day (mainSelectedDay) and the current day (today)
  const mainSelectedDay = selectedDay.format("MMM-D-YYYY");
  const today = moment().format("MMM-D-YYYY");
  const styleTag = `
  .row1 div#${mainSelectedDay}.currentMonth{
    background-color: #d2e3fc;
  }
  div#${today}.currentMonth{
    background-color: #1a73e8 !important;
  }
  `;
  /**
   * Defines onClick behavior for the create button; presents for if logged in, redirects to login in screen otherwise
   * @return {void}
   */
  const createEventForm = () => {
    if (!authInfo["token"] && !formTesting) {
      history.push("/login");
    } else {
      changeContent(
        <EventForm
          request="post"
          selectedDay={selectedDay}
          authInfo={authInfo}
          dropDownOptions={dropDownOptions}
          updateCalendars={updateCalendars}
          changeContent={changeContent}
          toggleFormFlag={toggleFormFlag}
        />
      );
      toggleFormFlag(true);
    }
  };

  return (
    <Switch>
      <Route path="/login">
        <Login setAuthInfo={setAuthInfo} />
      </Route>
      <Route path="/">
        <div className="App">
          <div id="pop-up-container">
            {popUpContent && (
              <Popup
                coords={popUpCoordinates}
                popUpContent={popUpContent}
                changeContent={changeContent}
                changeCoordinates={changeCoordinates}
                formFlag={formFlag}
                toggleFormFlag={toggleFormFlag}
              />
            )}
          </div>

          <Header
            menuButton={sidebarOnClick}
            displayToggle={displayToggle}
            headerMessage={headerMessage}
            todayButtonClick={todayButtonClick}
            backClick={backClick}
            forwardClick={forwardClick}
            changeDisplayValue={displayOption}
            username={authInfo.username}
            setAuthInfo={setAuthInfo}
            updateCalendars={updateCalendars}
          />
          <button id="create" onClick={createEventForm}>
            Create
          </button>
          <div className="row1">
            {sidebarOpen && (
              <Sidebar
                changeSelectedDay={changeSelectedDay}
                viewedDay={viewedDay}
                changeView={changeViewedDay}
                calendars={calendars}
                updateCalendars={updateCalendars}
              />
            )}
            <div id="big-container" style={bigContainerStyle}>
              <div id="inner">{display}</div>
              <style scoped="true">{styleTag}</style>
            </div>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default App;
