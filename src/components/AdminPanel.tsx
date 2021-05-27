import React, { useEffect, useState, useContext } from "react";
import "../style/css/main.css";
import Nav from "./Navs/LoggedNav";
import Firebase, { db } from "./services/Firebase";
import { Link } from "react-router-dom";
import HTML from "./subComponents/Html";
import NotLogged from "./subComponents/NotLogged";
import UserContext from "./services/UserContext";


function AdminPanel() {
  const userStatus = useContext(UserContext);
  const { user, setUser, userData, setUserData } = userStatus;
  const [users, setUsers] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [texts, setTexts] = useState<number>(0);
  const [reviewsQueue, setReviewsQueue] = useState<Array<Object>>()

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
            if(doc.data().role !== "admin"){
                notLoggedIn.style.display = "block"
            }else if(doc.data().role === "admin"){

                // get number of accounts
                db.collection('users').get().then((docs) => {
                    docs.forEach(() => {
                        setUsers(u => u + 1)                
                    })
                })

                // get reviews queue from play zone
                db.collection("playzone").doc("review").get().then((data: any) => {
                    if(data){
                        setReviews(data.data().queue.length)
                        setReviewsQueue(data.data().queue)
                    }
                })

                // get the play zone texts
                db.collection("playzone").doc("texts").get().then((data: any) => {
                    if(data){
                        setTexts(data.data().wrapper.length)
                    }
                })
            }
            spinner.style.display = "none";
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

  const config = require("../config.json")

  return (
    <>
      <HTML title={`${config.name} | Admin Panel`}/>

      {userData && userData.role === "admin" ? (
        <div className="panelWrapper">
            <Nav path="/play" name="Main Page" />
            <div className="panelContent">
                <h1>Admin Panel</h1>
                <div className="panelInfo">
                    <h2>Informations</h2>
                    <p>TypingHub Accounts: <span>{users}</span></p>
                    <p>Play Zone reviews in Queue: <span>{reviews}</span></p>
                    <p>Play Zone texts: <span>{texts}</span></p>
                </div>

                <div className="panelReviews">
                    <h2>Reviews in Queue</h2>
                        {
                          reviewsQueue ? 
                            reviewsQueue.map((d: any) => {
                              return (
                                <div className="text" key={Math.random() * 999}>
                                  <p className="author">Created by <Link to={`/user/${d.author}`}>{d.author} {d.typingHubID}</Link></p>
                                  <p className="playingText">{d.text}</p>
                                  <div className="buttons">
                                    <button>Accept</button>
                                    <button>Decline</button>
                                  </div>
                                  <p className="sendAt">Sent at: {d.time}</p>
                                </div>
                              )
                            })
                          : <div className="playZoneSpinner"></div>
                        }
                </div>
            </div>
        </div>
      ) : (
        <NotLogged adminRequest={true}/>
      )}
      <div className="loadingSpinnerProfile"></div>
    </>
  );
}

export default AdminPanel;
