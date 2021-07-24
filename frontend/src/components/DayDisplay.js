import React, { useState, useEffect } from "react";
import moment from "moment";
import { sortEvents } from "./utils";
import EventForm from "./EventForm";
const heightPixels = 44;
function DayDisplay(props) {
  let day = moment(props.selectedDay);
  let hourGrid = [];
  for (let x = 0; x < 24; x++) {
    hourGrid.push(x);
  }
  const eventCreate = (startTime) => (e) => {
    if (!props.authInfo["token"]) {
      props.history.push("/login");
    } else {
      const eventDate = moment(props.selectedDay).set({
        hour: parseInt(startTime),
      });
      props.changeContent(
        <EventForm
          selectedDay={eventDate}
          dropDownOptions={props.dropDownOptions}
          authInfo={props.authInfo}
          updateCalendars={props.updateCalendars}
          changeContent={props.changeContent}
        />
      );
      props.toggleFormFlag(true);
    }
  };
  const timeLabels = hourGrid.map((number) => {
    return <div style={{ height: `${heightPixels}px` }}>{number}</div>;
  });
  const grid = hourGrid.map((number) => {
    return (
      <div
        style={{
          display: "inline-block",
          height: `${heightPixels}px`,
          width: "100%",
          border: "1px solid gray",
        }}
      >
        <div
          style={{ height: "50%", width: "100%" }}
          onClick={eventCreate(number)}
        >
          &nbsp;
        </div>
        <div
          style={{ height: "50%", width: "100%" }}
          onClick={eventCreate(number + 0.5)}
        >
          &nbsp;
        </div>
      </div>
    );
  });
  const [displayEvents, changeDisplayEvents] = useState([]);
  useEffect(() => {
    changeDisplayEvents(
      (() => {
        let dayEvents = sortEvents(
          props.events[day.format("MMM-D-YYYY")] || []
        );
        let eventList = [];
        if (dayEvents) {
          let leftMargin = 0;
          dayEvents.forEach((eventItem, index, arr) => {
            let startTime = moment.utc(eventItem["start_date"]);
            let topMargin =
              parseInt(startTime.format("k")) * heightPixels +
              (parseInt(startTime.format("m")) / 60) * heightPixels;
            let endTime = moment.utc(eventItem["end_date"]);
            let height = endTime.isAfter(day, "day")
              ? 24 * heightPixels - topMargin
              : (endTime.diff(startTime, "minutes") / 60) * heightPixels;
            for (let i = 1; i <= index; i++) {
              if (moment.utc(arr[index - i]["end_date"]) > startTime) {
                leftMargin += 80;
                break;
              } else {
                leftMargin -= 80;
                if (leftMargin < 0) {
                  leftMargin = 0;
                  break;
                }
              }
            }
            // if (
            //   arr[index - 1] &&
            //   moment.utc(arr[index - 1]["end_date"]) > startTime
            // ) {
            //   leftMargin += 80;
            // }
            eventList.push(
              <div
                style={{
                  position: "absolute",
                  top: `${topMargin}px`,
                  left: `${leftMargin}px`,
                  width: "100%",
                  height: `${height}px`,
                  border: "1px solid black",
                  zIndex: "2",
                  backgroundColor: `#${eventItem.color}`,
                  borderRadius: "25px",
                  overflow: "hidden",
                }}
              >
                &nbsp;&nbsp;{eventItem.title || "(No title)"}
              </div>
            );
          });
        }
        return eventList;
      })()
    );
  }, [props.events, props.selectedDay]);
  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <p>{day.format("ddd")}</p>
        <p>{day.format("D")}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "left", height: "100%" }}>
        <div style={{ height: "100%" }}>{timeLabels}</div>
        <div style={{ position: "relative", width: "100%" }}>
          <div style={{ zIndex: "1", position: "absolute", width: "100%" }}>
            {grid}
          </div>
          <div
            id="eventsContainer"
            style={{
              position: "absolute",
              height: "100%",
              width: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
              }}
            >
              {displayEvents}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayDisplay;
