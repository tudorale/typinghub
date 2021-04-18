import React from "react";
import "../../style/css/main.css";
import { Link } from "react-router-dom";
const NotLogged = () => {
  return (
    <div className="notLoggedIn">
      <p>You must be logged in to view this page</p>
      <Link to="/sign-in">
        <button>Sign In</button>
      </Link>
    </div>
  );
};

export default NotLogged;
