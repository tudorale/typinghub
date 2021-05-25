import React, { useEffect, useState, useContext } from "react";
import "../style/css/main.css";
import Nav from "./Navs/LoggedNav";
import Pro from "../images/pro.jpg";
import Firebase, { db } from "./services/Firebase";
import { Link } from "react-router-dom";
import Card from "./subComponents/Card";
import NotLogged from "./subComponents/NotLogged";
import HTML from "./subComponents/Html";
import UserContext from "./services/UserContext";

function Play() {
  // states
  const [chat, setChat] = useState<any>();
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<Array<Object>>([]);
  const [timer, setTimer] = useState<number>(0);

  const [texts, setTexts] = useState<Array<Object> | undefined >(undefined);

  const userStatus = useContext(UserContext);
  const { user, setUser, userData, setUserData } = userStatus;

  // checking if the user is logged in or not and adding values to states
  useEffect(() => {
    let spinner = document.querySelector(
      ".slowNetworkSpinner"
    ) as HTMLDivElement;
    let notLogged = document.querySelector(".notLoggedIn") as HTMLDivElement;

    Firebase.auth().onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);

        // userdata
        db.collection("users")
          .doc(usr.uid)
          .get()
          .then((result) => {
            setUserData(result.data());

            if (!userData?.pro) {
              let spin = document.querySelector(
                ".chatSpinner"
              ) as HTMLDivElement;
              if (spin) {
                spin.style.display = "none";
              }
            }
          });

        // texts
        db.collection("playzone")
          .doc("texts")
          .onSnapshot(
            {
              includeMetadataChanges: true,
            },
            (doc: any) => {
              setTexts(doc.data().wrapper); 
            }
          );

        spinner.style.display = "none";

        // chat messages

        db.collection("chat")
          .doc("messages")
          .onSnapshot(
            {
              includeMetadataChanges: true,
            },
            (doc: any) => {
              setChat(doc.data().messages);
            }
          );
      } else {
        notLogged.style.display = "block";
        spinner.style.display = "none";

        let spin = document.querySelector(".chatSpinner") as HTMLDivElement;
        if (spin) {
          spin.style.display = "none";
        }
      }
    });
  }, []);

  // date for the messages
  let date = new Date();
  let h = date.getHours();
  let min = date.getMinutes();
  let s = date.getSeconds();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();

  // send message function that checks if the message contain something and is less than 200 chars.

  let Filter = require("bad-words"),
    filter = new Filter();

  const handleSentMessage = (e: any) => {
    e.preventDefault();
    let cooldown = document.querySelector(".cooldown") as HTMLParagraphElement;

    if (timer === 0) {
      if (message !== "" && message.length <= 200) {
        setTimer(3000); // 3 seconds cooldown
        let userMessage = {
          author: user?.displayName,
          authorImage: user?.photoURL,
          message: filter.clean(message),
          time: `${h}:${min}:${s} ${d}/${m}/${y}`,
          id: user?.uid,
          typingHubID: userData?.typingHubID,
        };

        db.collection("chat")
          .doc("messages")
          .get()
          .then((doc: any) => {
            let firestoreData = doc.data().messages;
            firestoreData.push(userMessage);
            db.collection("chat")
              .doc("messages")
              .update({
                messages: firestoreData,
              })
              .then(() => {
                setTimeout(() => {
                  setTimer(0);
                  cooldown.style.display = "none";
                }, 3000);
              });
          });

        let input = document.querySelector(".messageInput") as HTMLInputElement;
        input.value = "";
        input.focus();
        setMessage("");
      }
    } else {
      cooldown.style.display = "block";
    }
  };

  // scroll to bottom of the chat
  useEffect(() => {
    let content = document.querySelector(".chatContent") as HTMLDivElement;
    if (content) {
      content.scrollTop = content.scrollHeight;
    }
  }, [[], chat]);

  // leaderboard data
  useEffect(() => {
    db.collection("users")
      .orderBy("points", "desc")
      .limit(10)
      .get()
      .then((data: any) => {
        data.forEach((usr: any) => {
          setUsers((prevState: any) => [...prevState, usr.data()]);
        });
      })
      .catch((err) => {
        console.log("An error has occured: ", err.message);
      });
  }, []);

  // check their points and their level to database
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
  const config = require("../config.json")
  return (
    <>
      <HTML title={`${config.name} | Main page`}/>

      {user ? (
        <div className="extraWrapper">
          <Nav path="/account-settings" name="Account Settings" />
          <div className="playWrapper">
            <div className="playContent">
              <p className="phoneIndicator">
                IMPORTANT: You are viewing this website on a phone/tablet, for a
                better UI/UX please view this on desktop.
              </p>
              <div className="globalGrid">
                <div className="rowOne">
                  <div className="section-one">
                    <h1 className="roomsHeader">
                      Start typing{" "}
                      <span className="yourPoints">
                        {" "}
                        Your points:{" "}
                        {!userData ? "Loading..." : userData.points}
                      </span>
                    </h1>

                    <div className="card card1">
                      <Card
                        title="RANDOM"
                        tests={
                          userData ? `${userData.randomTests} Tests` : "Loading"
                        }
                        type="random"
                        button="Start typing"
                        points="20-40 points"
                      />

                      <svg
                        viewBox="0 0 200 200"
                        className="blob"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#5c17c4"
                          d="M23.6,-38.6C37.5,-32.8,60.6,-40.5,63.4,-36.4C66.2,-32.2,48.7,-16.1,47,-1C45.2,14.1,59.1,28.1,61.6,41.4C64.1,54.8,55.1,67.3,42.9,73.4C30.8,79.5,15.4,79.2,2.5,74.8C-10.3,70.4,-20.6,61.9,-32.1,55.4C-43.5,48.9,-56.1,44.3,-63.9,35.4C-71.7,26.4,-74.7,13.2,-69,3.3C-63.4,-6.7,-49.1,-13.4,-40.7,-21.3C-32.3,-29.1,-29.8,-38.2,-24,-48.7C-18.2,-59.1,-9.1,-71.1,-2.1,-67.4C4.8,-63.7,9.6,-44.4,23.6,-38.6Z"
                          transform="translate(100 100)"
                        />
                      </svg>
                    </div>

                    <div className="card card2">
                      <Card
                        title="QUOTES"
                        tests={
                          userData ? `${userData.quotesTests} Tests` : "Loading"
                        }
                        type="quotes"
                        button="Start typing"
                        points="50-80 points"
                      />

                      <svg
                        viewBox="0 0 200 200"
                        className="blob"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#5c17c4"
                          d="M23.6,-38.6C37.5,-32.8,60.6,-40.5,63.4,-36.4C66.2,-32.2,48.7,-16.1,47,-1C45.2,14.1,59.1,28.1,61.6,41.4C64.1,54.8,55.1,67.3,42.9,73.4C30.8,79.5,15.4,79.2,2.5,74.8C-10.3,70.4,-20.6,61.9,-32.1,55.4C-43.5,48.9,-56.1,44.3,-63.9,35.4C-71.7,26.4,-74.7,13.2,-69,3.3C-63.4,-6.7,-49.1,-13.4,-40.7,-21.3C-32.3,-29.1,-29.8,-38.2,-24,-48.7C-18.2,-59.1,-9.1,-71.1,-2.1,-67.4C4.8,-63.7,9.6,-44.4,23.6,-38.6Z"
                          transform="translate(100 100)"
                        />
                      </svg>
                    </div>

                    <div className="card card3">
                      <Card
                        title="CUSTOM TEXT"
                        tests={
                          userData ? `${userData.customTests} Tests` : "Loading"
                        }
                        type="custom"
                        button="Start typing"
                        points="20-40 points"
                      />

                      <svg
                        viewBox="0 0 200 200"
                        className="blob"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="#5c17c4"
                          d="M23.6,-38.6C37.5,-32.8,60.6,-40.5,63.4,-36.4C66.2,-32.2,48.7,-16.1,47,-1C45.2,14.1,59.1,28.1,61.6,41.4C64.1,54.8,55.1,67.3,42.9,73.4C30.8,79.5,15.4,79.2,2.5,74.8C-10.3,70.4,-20.6,61.9,-32.1,55.4C-43.5,48.9,-56.1,44.3,-63.9,35.4C-71.7,26.4,-74.7,13.2,-69,3.3C-63.4,-6.7,-49.1,-13.4,-40.7,-21.3C-32.3,-29.1,-29.8,-38.2,-24,-48.7C-18.2,-59.1,-9.1,-71.1,-2.1,-67.4C4.8,-63.7,9.6,-44.4,23.6,-38.6Z"
                          transform="translate(100 100)"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="section-four">
                    <h1 className="chatHeader">Global Chat</h1>
                    <div className="globalChat">
                      {userData ? (
                        !userData.pro ? (
                          <>
                            <div className="chatLocked"></div>
                            <div className="chatSpinner"></div>
                            <svg
                              className="lockedIconChat"
                              xmlns="http://www.w3.org/2000/svg"
                              width="44"
                              height="44"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="#6f32be"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path
                                stroke="none"
                                d="M0 0h24v24H0z"
                                fill="none"
                              />
                              <rect
                                x="5"
                                y="11"
                                width="14"
                                height="10"
                                rx="2"
                              />
                              <circle cx="12" cy="16" r="1" />
                              <path d="M8 11v-4a4 4 0 0 1 8 0v4" />
                            </svg>
                            <p className="mustPro">
                              You must be a PRO user to chat!
                            </p>
                            <p className="buyProChat">
                              <Link to="/pro">Buy Pro</Link>
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="chatContent">
                              {chat
                                ? chat.map((x: any) => {
                                    return (
                                      <div
                                        className="messageWrapper"
                                        key={
                                          Math.random() * 912391239132999.412
                                        }
                                      >
                                        <Link to={`/user/${x.author}`}>
                                          <img
                                            src={x.authorImage}
                                            className="profileImageChat"
                                            alt=""
                                          />
                                        </Link>
                                        <Link to={`/user/${x.author}`}>
                                          <p className="username">
                                            {x.author}{" "}
                                            <img
                                              src={Pro}
                                              className="proImage"
                                              alt=""
                                            />{" "}
                                            <span>{x.typingHubID}</span>
                                          </p>
                                        </Link>
                                        <p className="message">
                                          {x.message}{" "}
                                          <span>- sent at {x.time}</span>
                                        </p>
                                      </div>
                                    );
                                  })
                                : null}
                            </div>

                            <form onSubmit={handleSentMessage}>
                              <p className="length">{message.length}/200</p>
                              <p className="cooldown">
                                Wait, you can't spam like that
                              </p>
                              <input
                                type="text"
                                maxLength={200}
                                className="messageInput"
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message"
                              />

                              <div className="send" onClick={handleSentMessage}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="44"
                                  height="44"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="#6f32be"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path
                                    stroke="none"
                                    d="M0 0h24v24H0z"
                                    fill="none"
                                  />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                  <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
                                </svg>
                              </div>
                            </form>
                          </>
                        )
                      ) : (
                        <>
                          <div className="chatLocked"></div>
                          <div className="chatSpinner"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rowTwo">
                  <div className="section-five">
                    <h1 className="topHeader">Top 10</h1>
                    <div className="top10">
                      {users.length >= 1 ? (
                        users.map((d: any) => {
                          return (
                            <div
                              className="userWrapper"
                              key={Math.random() * 9999999999999999999}
                            >
                              <Link to={`/user/${d.username}`}>
                                <img
                                  className="lbImage"
                                  alt=""
                                  src={d.profileImage}
                                />
                              </Link>
                              <Link to={`/user/${d.username}`}>
                                <p className="lbUser">
                                  <span>{d.username}</span>{" "}
                                  {d.pro ? (
                                    <img src={Pro} alt="" className="lbPro" />
                                  ) : null}{" "}
                                  <span className="lbId">{d.typingHubID}</span>
                                </p>
                              </Link>
                              <p className="lbPoints">
                                {d.points} Points, {d.rank} ({d.races} Tests)
                              </p>
                            </div>
                          );
                        })
                      ) : (
                        <div className="lbSpinner"></div>
                      )}
                    </div>
                  </div>
                  
                  <div className="section-six">
                    <h1 className="playZoneHeader">Play Zone</h1>
                    <div className="playZone">
                      <p className="indication">Test your speed on custom texts made by the comunity users or <Link to="/speed/custom">add</Link> your own custom text.</p>
                      <div className="textsWrapper">
                        
                        {
                          texts ? 
                            texts.map((d: any) => {
                              return (
                                <div className="text" key={Math.random() * 999}>
                                  <p className="author">Created by <Link to={`/user/${d.author}`}>{d.author} {d.typingHubID}</Link></p>
                                  <p className="playingText">{d.text}</p>
                                  <Link to="/"><button>Take test</button></Link>
                                  <p className="testsTaken">Tests taken: {d.testsTaken}</p>
                                </div>
                              )
                            })
                          : <div className="playZoneSpinner"></div>
                        }
                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NotLogged />
      )}

      <div className="slowNetworkSpinner"></div>
    </>
  );
}

export default Play;
