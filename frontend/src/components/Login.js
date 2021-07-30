import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import { apiLink } from "./utils";
import axios from "axios";

/**
 * Login/register screen
 * @component
 * @param  {Object} props setAuthInfo
 * @return {JSX Element}
 */
function Login(props) {
  const [userName, setUserName] = useState(""); // Controls username field
  const [password, setPassWord] = useState(""); // Controls password field
  const [isLogin, setIsLogin] = useState(true); // Used to switch between login and registration screens
  const history = useHistory(); // Used to redirect to home page after login/registration
  const [errorMessage, setError] = useState("");

  // used for button to switch between registration and login
  const changePage = () => {
    setIsLogin(!isLogin);
  };

  // Used to change field states
  const handleChange = (changeFunction) => (e) => {
    changeFunction(e.target.value);
  };

  // form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(apiLink + (isLogin ? "api-token-auth/" : "register/"), {
        username: userName,
        password: password,
      })
      .then(
        (response) => {
          props.setAuthInfo(response.data);
          history.push("/");
        },
        (error) => {
          //console.log(error);
          setError("Invalid username/password");
        }
      );
  };
  return (
    <div id="screen">
      <div id="loginbox">
        <p>{isLogin ? "Login screen" : "Register screen"}</p>
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
        <p id="error">{errorMessage}</p>
        <button onClick={changePage}>
          {isLogin ? "Register" : "Back to login"}
        </button>
      </div>
    </div>
  );
}

export default Login;
