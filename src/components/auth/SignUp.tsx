import React, { useState, useEffect } from "react";
import "../../style/css/main.css";
import fire, { db } from "../services/Firebase";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import Html from "../subComponents/Html";
import { useHistory } from "react-router-dom";

function SignUp() {
  // states
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [buttonStatus, setButtonStatus] = useState("Sign Up");

  const history = useHistory();

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

  const seePassword = () => {
    let input = document.querySelector(".passInput") as HTMLInputElement;
    let eyeClosed = document.querySelector(".eyeClosedSignUp") as HTMLElement;
    eyeClosed.style.display = "block";
    let eyeOpen = document.querySelector(".eyeOpenSignUp") as HTMLElement;
    eyeOpen.style.display = "none";
    input.setAttribute("type", "text");
  };

  const hidePassword = () => {
    let input = document.querySelector(".passInput") as HTMLInputElement;
    let eyeClosed = document.querySelector(".eyeClosedSignUp") as HTMLElement;
    eyeClosed.style.display = "none";
    let eyeOpen = document.querySelector(".eyeOpenSignUp") as HTMLElement;
    eyeOpen.style.display = "block";
    input.setAttribute("type", "password");
  };

  // sign out on render
  useEffect(() => {
    fire.auth().signOut();
  }, []);

  // local array with every username from database
  let usernames: string[] = [];

  let date = new Date();
  let h = date.getHours();
  let min = date.getMinutes();
  let s = date.getSeconds();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();

  // create account logic and check if the usernames is already taken
  const handleCreateAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonStatus("Loading...");
    let btn = document.querySelector("#btn") as HTMLButtonElement;
    btn.setAttribute("disabled", "");

    if (username.length >= 4 && username.length <= 20) {
      db.collection("users")
        .get()
        .then((user) => {
          user.forEach((data) => {
            usernames.push(data.data().username);
          });
        })
        .then(() => {
          if (usernames.includes(username)) {
            setButtonStatus("Sign Up");
            setError("That username is already in use.");
          } else {
            fire
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then((cred: any) => {
                return db
                  .collection("users")
                  .doc(cred.user.uid)
                  .set({
                    id: cred.user.uid,
                    username: username,
                    races: 0,
                    role: "user",
                    points: 0,
                    description: "No description",
                    pro: false,
                    rank: "Beginner",
                    bestWPM: "0",
                    lastWPM: "0",
                    keyboardLayout: "Not set",
                    randomTests: 0,
                    quotesTests: 0,
                    customTests: 0,
                    randomHistory: [],
                    quotesHistory: [],
                    customHistory: [],
                    changedUsername: false,
                    payment: {},
                    notifications: [
                      {
                        sender: "JustType",
                        id: Math.floor(Math.random() * 999999999),
                        message:
                          "This is the section where you will recieve notifications from us, from events, and so on.",
                        time: `${h}:${min}:${s} ${d}/${m}/${y}`,
                      },
                    ],
                    justTypeID: `#${Math.floor(Math.random() * 9999)}`,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    profileImage:
                      "https://firebasestorage.googleapis.com/v0/b/justtype-preview.appspot.com/o/profileimage.jpg?alt=media&token=ff56cecc-ffce-42c5-8079-bcc806e70348",
                  });
              })
              .then(() => {
                let usr = fire.auth().currentUser;
                usr
                  ?.updateProfile({
                    displayName: username,
                    photoURL:
                      "https://firebasestorage.googleapis.com/v0/b/justtype-preview.appspot.com/o/profileimage.jpg?alt=media&token=ff56cecc-ffce-42c5-8079-bcc806e70348",
                  })
                  .then(() => {
                    // window.location.href = "/play";
                    history.push("/play");
                  });
              })
              .catch((error: any) => {
                setButtonStatus("Sign Up");
                btn.removeAttribute("disabled");
                setError(error.message);
              });
          }
        });
    }
  };

  return (
    <>
      <Html title="JustType - Sign Up"></Html>

      <div className="signup">
        <h1>
          <a href="/">Sign Up</a>
        </h1>

        <form onSubmit={handleCreateAccount}>
          <div className="usernameWrapper">
            <label htmlFor="username" className="userLabel">
              Username
            </label>
            <input
              type="text"
              id="username"
              maxLength={20}
              minLength={4}
              className="userInput"
              required
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => handleFocus(".userLabel", "5px")}
              onBlur={() => handleBlur(".userInput", ".userLabel", "30px")}
            />
          </div>

          <div className="emailWrapper">
            <label htmlFor="email" className="emailLabel">
              Valid email
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

          <div className="passwordWrapper">
            <label htmlFor="password" className="passLabel">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="passInput"
              required
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => handleFocus(".passLabel", "5px")}
              onBlur={() => handleBlur(".passInput", ".passLabel", "30px")}
            />

            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 512.001 512.001"
              className="eyeClosedSignUp"
              onClick={hidePassword}
            >
              <path
                d="M316.332,195.662c-4.16-4.16-10.923-4.16-15.083,0c-4.16,4.16-4.16,10.944,0,15.083
                      c12.075,12.075,18.752,28.139,18.752,45.248c0,35.285-28.715,64-64,64c-17.109,0-33.173-6.656-45.248-18.752
                      c-4.16-4.16-10.923-4.16-15.083,0c-4.16,4.139-4.16,10.923,0,15.083c16.085,16.128,37.525,25.003,60.331,25.003
                      c47.061,0,85.333-38.272,85.333-85.333C341.334,233.187,332.46,211.747,316.332,195.662z"
              />
              <path
                d="M270.87,172.131c-4.843-0.853-9.792-1.472-14.869-1.472c-47.061,0-85.333,38.272-85.333,85.333
                      c0,5.077,0.619,10.027,1.493,14.869c0.917,5.163,5.419,8.811,10.475,8.811c0.619,0,1.237-0.043,1.877-0.171
                      c5.781-1.024,9.664-6.571,8.64-12.352c-0.661-3.627-1.152-7.317-1.152-11.157c0-35.285,28.715-64,64-64
                      c3.84,0,7.531,0.491,11.157,1.131c5.675,1.152,11.328-2.859,12.352-8.64C280.534,178.702,276.652,173.155,270.87,172.131z"
              />

              <path
                d="M509.462,249.102c-2.411-2.859-60.117-70.208-139.712-111.445c-5.163-2.709-11.669-0.661-14.379,4.587
                      c-2.709,5.227-0.661,11.669,4.587,14.379c61.312,31.744,110.293,81.28,127.04,99.371c-25.429,27.541-125.504,128-230.997,128
                      c-35.797,0-71.872-8.64-107.264-25.707c-5.248-2.581-11.669-0.341-14.229,4.971c-2.581,5.291-0.341,11.669,4.971,14.229
                      c38.293,18.496,77.504,27.84,116.523,27.84c131.435,0,248.555-136.619,253.483-142.443
                      C512.854,258.915,512.833,253.091,509.462,249.102z"
              />

              <path
                d="M325.996,118.947c-24.277-8.171-47.829-12.288-69.995-12.288c-131.435,0-248.555,136.619-253.483,142.443
                      c-3.115,3.669-3.371,9.003-0.597,12.992c1.472,2.112,36.736,52.181,97.856,92.779c1.813,1.216,3.84,1.792,5.888,1.792
                      c3.435,0,6.827-1.664,8.875-4.8c3.264-4.885,1.92-11.52-2.987-14.763c-44.885-29.845-75.605-65.877-87.104-80.533
                      c24.555-26.667,125.291-128.576,231.552-128.576c19.861,0,41.131,3.755,63.189,11.157c5.589,2.005,11.648-1.088,13.504-6.699
                      C334.572,126.862,331.585,120.825,325.996,118.947z"
              />

              <path
                d="M444.865,67.128c-4.16-4.16-10.923-4.16-15.083,0L67.116,429.795c-4.16,4.16-4.16,10.923,0,15.083
                      c2.091,2.069,4.821,3.115,7.552,3.115c2.731,0,5.461-1.045,7.531-3.115L444.865,82.211
                      C449.025,78.051,449.025,71.288,444.865,67.128z"
              />
            </svg>

            <svg
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 511.992 511.992"
              className="eyeOpenSignUp"
              onClick={seePassword}
            >
              <path
                d="M510.096,249.937c-4.032-5.867-100.928-143.275-254.101-143.275C124.56,106.662,7.44,243.281,2.512,249.105
          c-3.349,3.968-3.349,9.792,0,13.781C7.44,268.71,124.56,405.329,255.995,405.329S504.549,268.71,509.477,262.886
          C512.571,259.217,512.848,253.905,510.096,249.937z M255.995,383.996c-105.365,0-205.547-100.48-230.997-128
          c25.408-27.541,125.483-128,230.997-128c123.285,0,210.304,100.331,231.552,127.424
          C463.013,282.065,362.256,383.996,255.995,383.996z"
              />
              <path
                d="M255.995,170.662c-47.061,0-85.333,38.272-85.333,85.333s38.272,85.333,85.333,85.333s85.333-38.272,85.333-85.333
          S303.056,170.662,255.995,170.662z M255.995,319.996c-35.285,0-64-28.715-64-64s28.715-64,64-64s64,28.715,64,64
          S291.28,319.996,255.995,319.996z"
              />
            </svg>
          </div>

          <p>
            Already have an account? <Link to="/sign-in">Sign In</Link>
          </p>
          <p>
            By clicking "Sign Up" you agree with our{" "}
            <Link to="/terms-and-conditions">Terms and Conditions</Link> and our{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>
          </p>
          <p>{error}</p>
          <button type="submit" id="btn">
            {buttonStatus}
          </button>
        </form>
      </div>
    </>
  );
}

export default SignUp;
