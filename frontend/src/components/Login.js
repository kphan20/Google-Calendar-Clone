import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./Login.css";
import { apiLink } from "./utils";
import axios from "axios";

function Login(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassWord] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const history = useHistory();
  const [errorMessage, setError] = useState("");
  const changePage = () => {
    setIsLogin(!isLogin);
  };
  const handleChange = (changeFunction) => (e) => {
    changeFunction(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(apiLink + (isLogin ? "api-token-auth/" : "register/"), {
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
          //console.log(error);
          setError("Invalid username/password");
        }
      );
  };
  // const handleRegistration = (e) => {
  //   e.preventDefault();
  //   axios
  //     .post(apiLink + "register/", {
  //       username: userName,
  //       password: password,
  //     })
  //     .then(
  //       (response) => {
  //         console.log(response);
  //         props.setAuthInfo(response.data);
  //         history.push("/");
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // };
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
