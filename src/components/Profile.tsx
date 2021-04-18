import React, { useEffect, useState } from "react";
import "../style/css/main.css";
import Nav from "./Navs/LoggedNav";
import Firebase, { db } from "./services/Firebase";
import { Link } from "react-router-dom";
import Pro from "../images/pro.jpg";
import HTML from "./subComponents/Html";
import NotLogged from "./subComponents/NotLogged";
import Statistics from "./services/Statistics";

function Profile() {
  const [user, setUser] = useState<any>("");
  const [userData, setUserData] = useState<any>("");
  const [randomData, setRandomData] = useState<number[]>([]);
  const [quotesData, setQuotesData] = useState<number[]>([]);
  const [customData, setCustomData] = useState<number[]>([]);

  const [randomDataTime, setRandomDataTime] = useState<string[]>([]);
  const [quotesDataTime, setQuotesDataTime] = useState<string[]>([]);
  const [customDataTime, setCustomDataTime] = useState<string[]>([]);

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((usr) => {
      let spinner = document.querySelector(
        ".loadingSpinnerProfile"
      ) as HTMLDivElement;
      let notLoggedIn = document.querySelector(
        ".notLoggedIn"
      ) as HTMLDivElement;

      if (usr) {
        setUser(usr);

        db.collection("users")
          .doc(usr.uid)
          .get()
          .then((doc: any) => {
            setUserData(doc.data());
            spinner.style.display = "none";
            setRandomData(doc.data().randomHistory.map((w: any) => w.wpm));
            setQuotesData(doc.data().quotesHistory.map((w: any) => w.wpm));
            setCustomData(doc.data().customHistory.map((w: any) => w.wpm));

            setRandomDataTime(doc.data().randomHistory.map((t: any) => t.time));
            setQuotesDataTime(doc.data().quotesHistory.map((t: any) => t.time));
            setCustomDataTime(doc.data().customHistory.map((t: any) => t.time));
          })
          .catch((err: any) => {
            console.log("An error has occured:", err.message);
          });
      } else {
        notLoggedIn.style.display = "block";
        spinner.style.display = "none";
      }
    });
  }, []);

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((usr) => {
      if (usr && userData) {
        if (userData.points >= 1200 && userData.points < 2200) {
          db.collection("users").doc(userData.id).update({
            rank: "Intermediate",
          });
        } else if (userData.points >= 2200) {
          db.collection("users").doc(userData.id).update({
            rank: "Advanced",
          });
        }
      }
    });
  }, [userData]);

  return (
    <>
      <HTML title="JustType - Your profile" />

      {userData ? (
        <div className="profileWrapper">
          <Nav path="/play" name="Main" />

          <div className="grid">
            <div className="first-section">
              <img
                src={
                  user
                    ? user?.photoURL
                    : "https://firebasestorage.googleapis.com/v0/b/justtype-preview.appspot.com/o/profileimage.jpg?alt=media&token=ff56cecc-ffce-42c5-8079-bcc806e70348"
                }
              />
              <div className="userInfo">
                <h1>
                  <span className="usern">{user.displayName}</span>
                  {userData.pro ? <img src={Pro} /> : ""}
                  <span className="jtId">{userData.justTypeID}</span>
                </h1>
                <p className="descriptionProfile">{userData.description}</p>
                <p className="pointsProfile">
                  {userData.points} Points ({userData.rank})
                </p>
              </div>
            </div>
            <div className="second-section">
              <h1>Account info</h1>
              <p>
                Points: <span>{userData.points}</span>
              </p>
              <p>
                Keyboard Layout: <span>{userData.keyboardLayout}</span>
              </p>
              <p>
                Best: <span>{userData.bestWPM} WPM</span>
              </p>
              <p>
                Last test: <span>{userData.lastWPM} WPM</span>
              </p>
              <p>
                Tests: <span>{userData.races}</span>
              </p>
              <p>
                Tests on random category: <span>{userData.randomTests}</span>
              </p>
              <p>
                Tests on quotes category: <span>{userData.quotesTests}</span>
              </p>
              <p>
                Tests on custom category: <span>{userData.customTests}</span>
              </p>
              <p className="profileNote">
                Change your account settings{" "}
                <Link to="/account-settings">here</Link>
              </p>
              {userData ? (
                !userData.pro ? (
                  <p className="wantPro">
                    You are not a Pro member, do you want to be one?{" "}
                    <Link to="/pro">Buy Pro</Link>
                  </p>
                ) : (
                  ""
                )
              ) : (
                <p>Checking...</p>
              )}

              <h1 className="moreStats">More statistics</h1>
              <p>
                Average WPM on random category:{" "}
                <span>
                  {randomData.length >= 2
                    ? Math.floor(
                        randomData.reduce((a, b): number => Math.floor(a + b)) /
                          randomData.length
                      )
                    : "You have to play more"}
                </span>
              </p>
              <p>
                Average WPM on quotes category:{" "}
                <span>
                  {quotesData.length >= 2
                    ? Math.floor(
                        quotesData.reduce((a, b): number => Math.floor(a + b)) /
                          quotesData.length
                      )
                    : "You have to play more"}
                </span>
              </p>
              <p>
                Average WPM on custom category:{" "}
                <span>
                  {customData.length >= 2
                    ? Math.floor(
                        customData.reduce((a, b): number => Math.floor(a + b)) /
                          customData.length
                      )
                    : "You have to play more"}
                </span>
              </p>

              {randomData.length >= 2 &&
              quotesData.length >= 2 &&
              customData.length >= 2 ? (
                <>
                  <Statistics
                    labels={randomDataTime}
                    wpm={randomData}
                    title="WPM on Random Category"
                    lineColor="#5c17c4"
                    pointColor="#20e6b4"
                  />

                  <Statistics
                    labels={quotesDataTime}
                    wpm={quotesData}
                    title="WPM on Quotes Category"
                    lineColor="#226be0"
                    pointColor="#d91ccc"
                  />

                  <Statistics
                    labels={customDataTime}
                    wpm={customData}
                    title="WPM on Custom Category"
                    lineColor="#5ce820"
                    pointColor="#e82077"
                  />
                </>
              ) : (
                <p className="restriction">
                  You have to take 2 tests on each category to unlock the
                  statistics.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <NotLogged />
      )}
      <div className="loadingSpinnerProfile"></div>
    </>
  );
}

export default Profile;
