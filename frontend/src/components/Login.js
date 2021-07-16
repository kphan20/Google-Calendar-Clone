import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import { apiLink } from "./utils";
import axios from "axios";

function Login(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassWord] = useState("");
  const history = useHistory();
  const handleChange = (changeFunction) => (e) => {
    changeFunction(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(apiLink + "api-token-auth/", {
        username: userName,
        password: password,
      })
      .then(
        (response) => {
          console.log(response);
          props.setAuthInfo(response.data);
          history.push("/");
        },
        (error) => {
          console.log(error);
        }
      );
  };
  return (
    <div id="screen">
      <div id="loginbox">
        <p>Login screen</p>
        <Link to="/">
          <p>x</p>
        </Link>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              onChange={handleChange(setUserName)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              onChange={handleChange(setPassWord)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
}

export default Login;
