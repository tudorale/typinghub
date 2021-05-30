import React, { useEffect, useState, useContext } from "react";
import "../../style/css/main.css";
import { Link, useHistory } from "react-router-dom";
import Firebase, { db } from "../services/Firebase";
import { HashLink } from "react-router-hash-link";
import UserContext from "../services/UserContext";

function LoggedNav(props: any) {
  // states
  const [notifications, setNotifications] = useState<any>("");

  const userStatus = useContext(UserContext);
  const { user, setUser} = userStatus;

  // ui stuff & checking if the user is logged in
  useEffect(() => {
    let isMounted = true;
    Firebase.auth().onAuthStateChanged((usr: any) => {
      if (usr) {
        if (isMounted) {
          setUser(usr);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true; // fixing a bug
    if (user) {
      db.collection("notifications")
        .doc("global")
        .onSnapshot(
          {
            includeMetadataChanges: true,
          },
          (doc: any) => {
            if (isMounted) {
              setNotifications(doc.data().wrapper);
            }
          }
        );
    }
    return () => {
      isMounted = false;
    };
  }, [user]);

  const history = useHistory();

  let mobileStatus = false;

  const handleMobile = () => {
    mobileStatus = !mobileStatus;

    let mobileNav = document.querySelector(
      ".mobileNavLogged"
    ) as HTMLDivElement;
    let effect = document.querySelector(".effectLogged") as HTMLDivElement;

    if (mobileStatus) {
      mobileNav.style.display = "block";
      effect.style.opacity = "0.5";
      effect.style.zIndex = "999";
    } else {
      mobileNav.style.display = "none";
      effect.style.opacity = "0";
      effect.style.zIndex = "-2";
    }
  };

  const handleRemoveMobile = () => {
    mobileStatus = false;

    let mobileNav = document.querySelector(
      ".mobileNavLogged"
    ) as HTMLDivElement;
    let effect = document.querySelector(".effectLogged") as HTMLDivElement;

    mobileNav.style.display = "none";
    effect.style.opacity = "0";
    effect.style.zIndex = "-2";
  };

  const handleSignOut = () => {
    Firebase.auth().signOut();
    history.push("/sign-in");
  };

  let notStatus = false;

  const handleNotifications = () => {
    notStatus = !notStatus;
    let wrapper = document.querySelector(
      ".notificationsWrapper"
    ) as HTMLDivElement;

    if (notStatus) {
      wrapper.style.zIndex = "900";
      wrapper.style.opacity = "1";
    } else {
      wrapper.style.zIndex = "-100";
      wrapper.style.opacity = "0";
    }
  };

  return (
    <>
      <div className="effectLogged" onClick={handleRemoveMobile}></div>

      <div className="navbarLogged">
        <h1 className="logoNavLogged">
          <HashLink to="/">
           TypingHu<span></span>
          </HashLink>
        </h1>

        <div className="navContent">
          <ul>
            <Link to={props.path}>
              <li>{props.name}</li>
            </Link>
          </ul>

          <Link to="/profile">
            <img
              src={
                user
                  ? user.photoURL
                  : "https://firebasestorage.googleapis.com/v0/b/justtype-preview.appspot.com/o/profileimage.jpg?alt=media&token=ff56cecc-ffce-42c5-8079-bcc806e70348"
              }
              className="profileImageMobile"
              alt=""
            />
          </Link>

          <div className="notifications">
            <div className="notificationBox" onClick={handleNotifications}>
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
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
              </svg>
            </div>

            <div className="notificationsWrapper">
              <h1>Notifications</h1>
              {notifications ? 
                notifications.length >= 1 ? (
                  notifications.map((x: any) => {
                    return (
                      <div className="notification" key={x.id}>
                        <p className="sender">
                          <span>from</span> {x.sender}
                        </p>
                        <p className="notificationMessage">
                          {x.message} <span> - {x.time}</span>
                        </p>
                      </div>
                    );
                  })
                ) : <p className="zeroNotifications">You have zero notifications!</p>
              : (
                <div className="notificationSpinner"></div>
              )}
            </div>
          </div>

          <button className="navButtonLogged" onClick={handleSignOut}>
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
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M20 12h-13l3 -3m0 6l-3 -3" />
            </svg>
            <p>Sign Out</p>
          </button>

          <div className="hamburgerLogged" onClick={handleMobile}>
            <div className="lineLogged  line1"> </div>
            <div className="lineLogged line2"> </div>
            <div className="lineLogged  line3"> </div>
          </div>
        </div>
      </div>

      <div className="mobileNavLogged">
        <h1 className="logoNavMobileLogged">
          <HashLink to="/">
           TypingHu<span></span>
          </HashLink>
        </h1>

        <div className="navContentMobile">
          <ul>
            {props.play ? (
              <a href={props.path}>{props.name}</a>
            ) : (
              <Link to={props.path}>
                <li>{props.name}</li>
              </Link>
            )}
          </ul>

          <Link to="/profile">
            <img
              src={
                user
                  ? user.photoURL
                  : "https://firebasestorage.googleapis.com/v0/b/justtype-preview.appspot.com/o/profileimage.jpg?alt=media&token=ff56cecc-ffce-42c5-8079-bcc806e70348"
              }
              className="profileImageMobile"
              alt=""
            />
          </Link>

          <button className="navButtonMobileLogged" onClick={handleSignOut}>
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
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M20 12h-13l3 -3m0 6l-3 -3" />
            </svg>
            <p>Sign Out</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default LoggedNav;
