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
  const [users, setUsers] = useState<number>(0)

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
                    <p>TypingHub Accounts: {users}</p>
                    <p>Play Zone reviews in Queue: </p>
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
