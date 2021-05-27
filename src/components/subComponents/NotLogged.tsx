import React from "react";
import "../../style/css/main.css";
import { Link } from "react-router-dom";
const NotLogged = (props: any) => {
  return (
    <div className="notLoggedIn">
      <p>{props.adminRequest ? "You need to be an admin to view this page" : "We are so sorry but you must be logged in to view this page"}</p>
      <div className="buttons">
        <Link to="/sign-in">
          <button>Sign In</button>
        </Link>
        <Link to="/sign-up">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default NotLogged;
