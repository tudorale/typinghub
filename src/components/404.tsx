import React from "react";
import "../style/css/main.css";
import { Link } from "react-router-dom";
import HTML from "./subComponents/Html";
function Page404() {
  const config = require("../config.json")
  return (
    <>
      <HTML title={`${config.name} | Page not found`} />
      <div className="pageNotFound">
        <h1>ERROR 404</h1>
        <p>
          Hey, we are so sorry but this page does not exist on our system,
          please use one of the buttons below to be redirected.
        </p>

        <div className="buttonsNotFound">
          <Link to="/play">
            <button>Play</button>
          </Link>
          <Link to="/sign-in">
            <button>Sign In</button>
          </Link>
          <Link to="/">
            <button>Landing Page</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Page404;
