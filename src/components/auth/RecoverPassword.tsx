import React, { useState } from "react";
import "../../style/css/main.css";
import { Link } from "react-router-dom";
import Firebase from "../services/Firebase";
import Html from "../subComponents/Html";

function Recover() {
  //states
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  // ui functions
  const handleFocus = (label: string, pxUp: string): void => {
    let l = document.querySelector<HTMLElement>(`${label}`)!;

    if (l) {
      l.style.top = `${pxUp}`;
      l.style.fontSize = "1rem";
    }
  };

  const handleBlur = (input: string, label: string, pxDown: string): void => {
    let l = document.querySelector<HTMLElement>(`${label}`)!;
    let i = document.querySelector(`${input}`) as HTMLInputElement;
    if (l) {
      if (i.value === "") {
        l.style.top = `${pxDown}`;
        l.style.fontSize = "1.1rem";
      } else {
        return;
      }
    }
  };

  // send password recovery

  const handleRecover = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let btn = document.querySelector("#btn") as HTMLButtonElement;
    btn.setAttribute("disabled", "");

    if (email !== "") {
      Firebase.auth()
        .sendPasswordResetEmail(email)
        .then(function () {
          setError(
            "You recieved an email, please follow the instructions to reset your password."
          );
        })
        .catch(function (error) {
          btn.removeAttribute("disabled");
          setError(error.message);
        });
    } else {
      setError("That input can not be blank.");
      btn.removeAttribute("disabled");
    }
  };
  const config = require("../../config.json")
  return (
    <div className="recover">
      <Html title={`${config.name} | Recover password`}></Html>
      <h1>
        <Link to="/">Forgot password?</Link>
      </h1>

      <form onSubmit={handleRecover}>
        <p className="instructions">
          Please enter your account email and click the "Send" button, you
          should recieve an email from us, follow the instructions to reset your
          account password.
        </p>
        <div className="emailWrapperRecover">
          <label htmlFor="email" className="emailLabel">
            Account email
          </label>
          <input
            type="email"
            id="email"
            className="emailInput"
            required
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => handleFocus(".emailLabel", "5px")}
            onBlur={() => handleBlur(".emailInput", ".emailLabel", "30px")}
          />
        </div>
        <p className="recoverError">{error}</p>
        <button id="btn">Send</button>
      </form>

      <Link to="/sign-in">Sign In</Link>
    </div>
  );
}

export default Recover;
