import React, { useEffect, useState, useContext } from "react";
import HTML from "./subComponents/Html";
import Navigation from "./Navs/InfoNav";
import "../style/css/main.css";
import Firebase, { db } from "./services/Firebase";
import { Link } from "react-router-dom";
import ProBadge from "../images/pro.jpg";
import PayPal from "./services/PayPal";
import UserContext from "./services/UserContext";

function Pro() {
  const userStatus = useContext(UserContext);
  const { user, setUser, userData, setUserData} = userStatus;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonStatus, setButtonStatus] = useState("Log In");
  const [error, setError] = useState("");

  useEffect(() => {
    let spinner = document.querySelector(
      ".loadingSpinnerPro"
    ) as HTMLDivElement;

    let loginBox = document.querySelector(".loginBox") as HTMLDivElement;
    let pro = document.querySelector(".proBox") as HTMLDivElement;
    Firebase.auth().onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);

        db.collection("users")
          .doc(usr.uid)
          .get()
          .then((result) => {
            setUserData(result.data());
          });

        if (spinner) {
          spinner.style.display = "none";
        }
        if (pro) {
          pro.style.display = "block";
        }
        if (loginBox) {
          loginBox.style.display = "none";
        }
      } else {
        if (spinner) {
          spinner.style.display = "none";
        }
        if (loginBox) {
          loginBox.style.display = "block";
        }
      }
    });
  }, [user]);

  // ui functions
  const handleFocus = (label: string, pxUp: string): void => {
    let l = document.querySelector<HTMLElement>(`${label}`)!;

    if (l) {
      l.style.marginTop = `${pxUp}`;
      l.style.fontSize = ".8rem";
    }
  };

  const handleBlur = (input: string, label: string, pxDown: string): void => {
    let l = document.querySelector<HTMLElement>(`${label}`)!;
    let i = document.querySelector(`${input}`) as HTMLInputElement;
    if (l) {
      if (i.value === "") {
        l.style.marginTop = `${pxDown}`;
        l.style.fontSize = "1rem";
      } else {
        return;
      }
    }
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonStatus("Loading...");
    let btn = document.querySelector("#btn") as HTMLButtonElement;
    btn.setAttribute("disabled", "");

    let loginBox = document.querySelector(".loginBox") as HTMLDivElement;
    let pro = document.querySelector(".proBox") as HTMLDivElement;

    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        loginBox.style.display = "none";
        pro.style.display = "block";
      })
      .catch((error) => {
        setButtonStatus("Log In");
        btn.removeAttribute("disabled");
        setError(error.message);
      });
  };

  return (
    <>
      <HTML title="JustType - Pro membership" />
      <Navigation />
      {user ? (
        <div className="proBox">
          <h1>JustType Pro Membership</h1>
          <h2>What you will get?</h2>
          <p>- Global chat access</p>
          <p>
            - Pro badge <img src={ProBadge} alt="" />
          </p>
          <p>- Fast responses from us</p>
          <p>- Permanent membership</p>
          <p>- Change username multiple times</p>
          <p>And more features along the way.</p>
          <p>
            {userData
              ? userData.pro
                ? "NOTE: You already have a Pro Membership"
                : ""
              : ""}
          </p>

          <h2>Buy the pro membership</h2>
          <PayPal />
        </div>
      ) : (
        <div className="loginBox">
          <h1>First, you will have to log in with your account.</h1>
          <form onSubmit={handleSignIn}>
            <div className="email">
              <label htmlFor="email" id="label1">
                E-mail
              </label>
              <input
                type="email"
                required
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                onFocus={() => handleFocus("#label1", "2px")}
                onBlur={() => handleBlur("#email", "#label1", "15px")}
              />
            </div>

            <div className="password">
              <label htmlFor="password" id="label2">
                Password
              </label>
              <input
                type="password"
                required
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onFocus={() => handleFocus("#label2", "2px")}
                onBlur={() => handleBlur("#password", "#label2", "15px")}
              />
            </div>

            <Link to="/recover-password">Forgot password?</Link>

            <button id="btn">{buttonStatus}</button>
            <p>{error}</p>
          </form>
        </div>
      )}

      <div className="loadingSpinnerPro"></div>
    </>
  );
}

export default Pro;
