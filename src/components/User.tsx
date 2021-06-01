import React, { useEffect, useState, useContext } from "react";
import "../style/css/main.css";
import Nav from "./Navs/LoggedNav";
import Firebase, { db } from "./services/Firebase";
import Pro from "../images/pro.jpg";
import NotLogged from "./subComponents/NotLogged";
import HTML from "./subComponents/Html";
import Statistics from "./services/Statistics";
import UserContext from "./services/UserContext";
import Linkify from "react-linkify";
import Admin from "../images/admin.svg";

const User = (props: any) => {
  const config = require("../config.json")
  const username = props.match.params.username;
  const [status, setStatus] = useState("");
  const [haveAUser, setHaveAUser] = useState<boolean>(false);
  const userStatus = useContext(UserContext);
  const { user, setUser, userData, setUserData } = userStatus;

  const [randomData, setRandomData] = useState<number[]>([]);
  const [quotesData, setQuotesData] = useState<number[]>([]);
  const [customData, setCustomData] = useState<number[]>([]);

  const [randomDataTime, setRandomDataTime] = useState<string[]>([]);
  const [quotesDataTime, setQuotesDataTime] = useState<string[]>([]);
  const [customDataTime, setCustomDataTime] = useState<string[]>([]);

  let allUsernames: string[] = [];

  useEffect(() => {
    let spinner = document.querySelector(".userPageSpinner") as HTMLDivElement;
    let notLoggedIn = document.querySelector(".notLoggedIn") as HTMLDivElement;

    setHaveAUser(false);

    Firebase.auth().onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);
        spinner.style.display = "none";

        db.collection("users")
          .get()
          .then((user) => {
            user.forEach((data) => {
              allUsernames.push(data.data().username);
            });
          })
          .then(() => {
            if (allUsernames.includes(username)) {
              db.collection("users")
                .where("username", "==", username)
                .get()
                .then((query: any) => {
                  setHaveAUser(true);
                  query.forEach((doc: any) => {
                    setUserData(doc.data());
                    setStatus("");

                    setRandomData(
                      doc.data().randomHistory.map((w: any) => w.wpm)
                    );
                    setQuotesData(
                      doc.data().quotesHistory.map((w: any) => w.wpm)
                    );
                    setCustomData(
                      doc.data().customHistory.map((w: any) => w.wpm)
                    );

                    setRandomDataTime(
                      doc.data().randomHistory.map((t: any) => t.time)
                    );
                    setQuotesDataTime(
                      doc.data().quotesHistory.map((t: any) => t.time)
                    );
                    setCustomDataTime(
                      doc.data().customHistory.map((t: any) => t.time)
                    );
                  });
                });
            } else {
              setStatus(
                "This user does not exist or his/her account might have been deleted or the username was changed."
              );
            }
          });
      } else {
        notLoggedIn.style.display = "block";
        spinner.style.display = "none";
      }
    });

    return () => setHaveAUser(false);
  }, []);

  return (
    <>
      <HTML
        title={`${config.name} | ${haveAUser && username ? username : "User"} page`}
      />

      {userData && user ? (
        <div className="userPageWrapper">
          <Nav path="/play" name="Main" />
          <div className="userPageContent">
            <p className="userPageStatus">{status}</p>
            {haveAUser && userData ? (
              <div className="userPageGrid">
                <div className="userSectionOne">
                  <img src={userData.profileImage} alt="" />
                  <div className="userPageInfo">
                    <h1>
                      {userData.username}
                      {userData.role === "admin" ? <img className="adminIcon" src={Admin} alt="" /> : ""}
                      {userData.pro ? <img className="proIcon" src={Pro} /> : null}
                      <span>{userData.typingHubID}</span>
                    </h1>
                    <Linkify>
	                    <div className="userPageDescription">
	                      {userData.description}
	                    </div>
                    </Linkify>
                    <p className="userPagePoints">{`${userData.points} Points (${userData.rank})`}</p>
                  </div>
                </div>
                <div className="userSectionTwo">
                  <h1>Public info</h1>
                  {
                    userData.role === "admin" ? <p className="adminInfo">This user is a TypingHub Admin <img className="adminIcon" src={Admin} alt="" /></p> : ""
                  }
                  <p>
                    Points: <span>{`${userData.points}`}</span>
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
                    Tests on random category:{" "}
                    <span>{userData.randomTests}</span>
                  </p>
                  <p>
                    Tests on quotes category:{" "}
                    <span>{userData.quotesTests}</span>
                  </p>
                  <p>
                    Tests on custom category:{" "}
                    <span>{userData.customTests}</span>
                  </p>
                  <p>
                    Account created on:{" "}
                    <span>{`${userData.timestamp.toDate().getDate()}/${
                      userData.timestamp.toDate().getMonth() + 1
                    }/${userData.timestamp.toDate().getFullYear()}`}</span>
                  </p>

                  <h1 style={{ marginTop: "25px" }}>Public statistics</h1>
                  <p>
                    Average WPM on random category:{" "}
                    <span>
                      {randomData.length >= 2
                        ? Math.floor(
                            randomData.reduce((a, b): number =>
                              Math.floor(a + b)
                            ) / randomData.length
                          )
                        : "Unavailable"}
                    </span>
                  </p>
                  <p>
                    Average WPM on quotes category:{" "}
                    <span>
                      {quotesData.length >= 2
                        ? Math.floor(
                            quotesData.reduce((a, b): number =>
                              Math.floor(a + b)
                            ) / quotesData.length
                          )
                        : "Unavailable"}
                    </span>
                  </p>
                  <p>
                    Average WPM on custom category:{" "}
                    <span>
                      {customData.length >= 2
                        ? Math.floor(
                            customData.reduce((a, b): number =>
                              Math.floor(a + b)
                            ) / customData.length
                          )
                        : "Unavailable"}
                    </span>
                  </p>

                  {randomData.length >= 2 && quotesData.length >= 2 ? (
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

                      {customData.length >= 2 ? (
                        <Statistics
                          labels={customDataTime}
                          wpm={customData}
                          title="WPM on Custom Category"
                          lineColor="#5ce820"
                          pointColor="#e82077"
                        />
                      ) : (
                        <p style={{ marginTop: "30px" }}>
                          This user didn't play enough in the "custom" category
                          to unlock the statistics.
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="restriction">
                      This user did not play enough to unlock the statistics.
                    </p>
                  )}
                </div>
              </div>
            ) : status === "" ? (
              <div className="userPageSpinnerTwo"></div>
            ) : null}
          </div>
        </div>
      ) : (
        <NotLogged />
      )}
      <div className="userPageSpinner"></div>
    </>
  );
};

export default User;
