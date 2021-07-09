import logo from "./logo.svg";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css";
import React, { useState } from "react";

function App() {
  const [sidebarOpen, sidebarToggle] = useState(true);

  function onClick() {
    sidebarToggle(!sidebarOpen);
  }

  const [displayOption, displayToggle] = useState("Day");

  const displaySelect = (e) => {
    displayToggle(e.target.value);
  };
  return (
    <div className="App">
      <Header menuButton={onClick} displaySelect={displaySelect} />
      <button id="create">Create</button>
      <div class="row1">
        {sidebarOpen && <Sidebar />}
        <div id="big-container">
          <div id="top-left"></div>
          <div id="inner">{displayOption}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
