import React, { useEffect, useState, useContext } from "react";
import "../style/css/main.css";
import Nav from "./Navs/LoggedNav";
import Firebase, { db } from "./services/Firebase";
import { Link } from "react-router-dom";
import HTML from "./subComponents/Html";
import NotLogged from "./subComponents/NotLogged";
import UserContext from "./services/UserContext";

interface reviewText{
    author: string,
    text: string,
    time?: string,
    id: string,
    typingHubID: string,
}


function AdminPanel() {
  const userStatus = useContext(UserContext);
  const { user, setUser, userData, setUserData } = userStatus;
  const [users, setUsers] = useState<number>(0);
  const [reviews, setReviews] = useState<number>(0);
  const [texts, setTexts] = useState<number>(0);
  const [reviewsQueue, setReviewsQueue] = useState<Array<reviewText>>([])
  const [actionStatus, setActionStatus] = useState<string>("");

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
                db.collection("playzone")
                .doc("review")
                .onSnapshot(
                  {
                    includeMetadataChanges: true,
                  },
                  (data: any) => {
                    if(data){
                      setReviews(data.data().queue.length)
                      setReviewsQueue(data.data().queue)
                    }
                  }
                );

                // get the play zone texts
                db.collection("playzone").doc("texts").onSnapshot(
                  {
                    includeMetadataChanges: true,
                  },
                  (data: any) => {
                    if(data){
                      setTexts(data.data().wrapper.length)
                    }
                  }
                )
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

  const handleAccept = (id: string) => {
    for(let i = 0; i < reviewsQueue.length; i++){
        if(reviewsQueue[i].id === id){
            let newArray = reviewsQueue[i];

            // add the text to the play zone
            db.collection("playzone").doc("texts").get().then((data: any) => {
              let firestoreData = data.data().wrapper;
              firestoreData.push(newArray);
              db.collection("playzone").doc("texts").update({
                wrapper: firestoreData
              }).then(() => {
                  // then remove the text from the reviews queue
                  reviewsQueue.splice(i);
                  db.collection("playzone").doc("review").update({
                    queue: reviewsQueue
                  }).then(() => {
                    setActionStatus("Status: The text was added to the playzone and removed from review queue.")
                  }).catch(() => {
                    setActionStatus("Status: An error occured, please refresh the page.")
                  })
              })
            })

        }
    }
  }

  const handleDecline = (id: string) => {
    for(let i = 0; i < reviewsQueue.length; i++){
      if(reviewsQueue[i].id === id){
          reviewsQueue.splice(i); // remove the object with index i

          // delete from firestore
          db.collection("playzone").doc("review").update({
            queue: reviewsQueue
          }).then(() => {
            setActionStatus("Status: The text was removed from the review queue.")
          })
          .catch(() => {
            setActionStatus("Status: An error occured, please refresh the page.")
          })
      }
    }
  }

  const handleNotification = () => {

  }
 
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
                    <p>{actionStatus}</p>
                        {
                          reviewsQueue ? 
                            reviewsQueue.length >= 1 ?
                                reviewsQueue.map((d: any) => {
                                return (
                                    <div className="text" key={Math.random() * 999}>
                                    <p className="author">Created by <Link to={`/user/${d.author}`}>{d.author} {d.typingHubID}</Link></p>
                                    <p className="playingText">{d.text}</p>
                                    <div className="buttons">
                                        <button onClick={() => handleAccept(d.id)}>Accept</button>
                                        <button onClick={() => handleDecline(d.id)}>Decline</button>
                                    </div>
                                    <p className="sendAt">Sent at: {d.time}</p>
                                    </div>
                                )
                                })
                            : <p>No reviews in queue, good job</p>
                          : <div className="playZoneSpinner"></div>
                        }
                </div>
            
                <div className="panelNotifications">
                  <h2>Send a global notification</h2>

                  <input placeholder="Text" id="text" />
                  <input placeholder="Sender" id="sender" />

                  <button className="sendButton" onClick={handleNotification}>Send notification</button>
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
