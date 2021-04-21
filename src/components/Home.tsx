import React, { useState, useEffect } from "react";
import "../style/css/main.css";
import emailjs from "emailjs-com";
import Nav from "./Navs/Navigation";
import { Link } from "react-router-dom";
import Firebase from "./services/Firebase";
import Progress from "../images/progress.png";
import { HashLink } from "react-router-hash-link";

declare global {
  interface Window {
    localStorage: any;
  }
}

function Home() {
  // ui stuff
  const [emailStatus, setEmailStatus] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);

  const interval = React.useRef<any>();

  const startCountdown = () => {
    interval.current = setInterval(() => {
      setTimer((s) => s - 1);
    }, 1000);
  };

  useEffect(() => {
    let cooldown = document.querySelector(
      ".emailRestriction"
    ) as HTMLParagraphElement;
    if (timer === 0) {
      cooldown.style.display = "none";
      clearInterval(interval.current);
    }
  }, [timer]);

  useEffect(() => {
    Firebase.auth().signOut();
  }, []);

  const handleFocus = (label: string, pxUp: string): void => {
    let l = document.querySelector<HTMLElement>(`${label}`)!;
    if (l) {
      l.style.marginTop = `${pxUp}`;
      l.style.fontSize = "1rem";
    }
  };

  const handleBlur = (input: string, label: string, pxDown: string): void => {
    let l = document.querySelector<HTMLElement>(`${label}`)!;
    let i = document.querySelector<HTMLInputElement>(`${input}`)!.value;
    if (l) {
      if (i === "") {
        l.style.marginTop = `${pxDown}`;
        l.style.fontSize = "1.1rem";
      } else {
        return;
      }
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    let l1 = document.querySelector<HTMLElement>(`.nameLabel`)!;
    let l2 = document.querySelector<HTMLElement>(`.emailLabel`)!;
    let l4 = document.querySelector<HTMLElement>(`.messageLabel`)!;
    let loading = document.querySelector<HTMLElement>(".loading")!;

    if (loading) {
      loading.style.opacity = "1";
    }
    let cooldown = document.querySelector(
      ".emailRestriction"
    ) as HTMLParagraphElement;

    setEmailStatus("");

    if (timer === 0) {
      emailjs
        .sendForm(
          "service_srvaoe4",
          "template_4p6r7zt",
          e.target,
          "user_Nhfa1wRoTgxUK7tXg0nDn"
        )
        .then(
          () => {
            e.target.reset();
            setTimer(120);

            startCountdown();

            setEmailStatus(
              "Your email has been sent, as soon as we can we will respond. Thank you!"
            );

            loading.style.opacity = "0";
            l1.style.marginTop = "13px";
            l2.style.marginTop = "13x";
            l4.style.marginTop = "13px";
            l1.style.fontSize = "1.1rem";
            l2.style.fontSize = "1.1rem";
            l4.style.fontSize = "1.1rem";
          },
          () => {
            loading.style.opacity = "0";
            setEmailStatus(
              "Something went wrong, try again or check the inputs."
            );
          }
        );
    } else {
      if (loading) {
        loading.style.opacity = "0";
      }
      cooldown.style.display = "block";
    }
  };

  return (
    <>
      <div className="content">
        <Nav />
        <div className="hero">
          <h1>
            <span>Join</span> into the next biggest{" "}
            <span>competitive platform</span> for typists and be the number one.
          </h1>

          <div className="hero_buttons">
            <Link to="/sign-in">
              <button className="heroButton sign">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="signinIcon"
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
                <p>Sign In</p>
              </button>
            </Link>

            <Link to="/sign-up">
              <button className="heroButton join">
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
                  <circle cx="9" cy="7" r="4" />
                  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  <path d="M16 11h6m-3 -3v6" />
                </svg>
                <p>Join</p>
              </button>
            </Link>
          </div>

          <div className="arrows">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="arrow"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 15l-6 -6l-6 6h12" transform="rotate(180 12 12)" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="arrow"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 15l-6 -6l-6 6h12" transform="rotate(180 12 12)" />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="arrow"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 15l-6 -6l-6 6h12" transform="rotate(180 12 12)" />
            </svg>
          </div>
        </div>
        <h1 className="watermark">FREE</h1>

        <div className="subHero_content">
          <div className="what" id="what">
            <h1>What you will find?</h1>

            <div className="cards">
              <div className="card card-1">
                <h1>Ranking system</h1>
                <p>
                  The ranking will be based on your number of points, for start
                  you will have 0 points, you gain points by taking tests,
                  depends in what category are you typing and what score you are
                  getting, with the help from these points you can get in the
                  leaderboard and get a rank (beginner, intermediate, advanced).
                </p>
              </div>

              <div className="card card-2">
                <h1>Leaderboard</h1>
                <p>
                  A top 10 leaderboard on the main page, in the leaderboard you
                  will find the players and their points and how many tests have
                  they taken also the users can go on your profile if they want,
                  the leaderboard will be based on the points that you get from
                  tests. At the end of the month the user with the most points
                  will get PRO membership <span>*</span>.
                  <br /> <br />
                  <span>*</span> - if the winner already has a membership he
                  will get +200 points.
                </p>
              </div>

              <div className="card card-3">
                <h1>Tests</h1>
                <p>
                  You have three categories where you can play, random, quotes
                  and custom, on each category you will find a different system
                  of typing, for example on "random" category you will have only
                  lowercase random words. You have to make a minimum number of
                  WPM to get the normal amount of points and an accuracy that is
                  above 70% - non-abusing system.
                </p>
              </div>
            </div>
          </div>

          <h1 className="addon" id="about">
            Improve your typing <span>speed</span> with us by taking tests on
            different categories, and keep track of your progress.
          </h1>

          <img src={Progress} alt="" id="progress" />

          <div className="about">
            <h1>About</h1>

            <p>
              <span>JustType</span> is a <span>free to use platform</span> where
              you can improve your typing speed by taking tests in three
              categories, random, quotes, and custom, by playing you are getting
              points and you can get into the leaderboard!.
              <span> JustType</span> was started on 1 May 2021 by
              <span> Tudor Alexandru</span> and it will be the next biggest
              competitive platform for people like me who love to type at the
              computer. You can play for free and if you want to support me you
              can buy the <span>PRO</span> membership.
            </p>
          </div>

          <div className="pro">
            <h1>
              Support the creator with a <span>PRO Membership</span> for your
              account!
            </h1>

            <div className="pro_content">
              <p>
                - Global chat access
                <br />
                - PRO badge next to your name
                <br />
                - Fast responses from us
                <br />
                - Permanent membership
                <br />
                - No cashback
                <br />
                - Change your username multiple times
                <br />
                - Paymant via PayPal
                <br />
                - Customize your profile - Coming soon
                <br />
              </p>
            </div>

            <HashLink to="/pro">
              <button id="contact">Buy now! $4.99</button>
            </HashLink>
          </div>

          <div className="contact">
            <h1>Contact</h1>
            <p>
              Fill the form below if you want to send an email to us, we will
              respond as soon as we can!
            </p>

            <form onSubmit={handleSubmit}>
              <div className="nameWrapper">
                <label htmlFor="name" className="nameLabel label">
                  Your name
                </label>
                <input
                  type="text"
                  required
                  onBlur={() => handleBlur(".name", ".nameLabel", "13px")}
                  onFocus={() => handleFocus(".nameLabel", "-11px")}
                  className="name"
                  id="name"
                  name="name"
                />
              </div>

              <div className="emailWrapper">
                <label htmlFor="email" className="emailLabel label">
                  Your email
                </label>
                <input
                  type="email"
                  required
                  onBlur={() => handleBlur(".email", ".emailLabel", "13px")}
                  onFocus={() => handleFocus(".emailLabel", "-11px")}
                  className="email"
                  id="email"
                  name="email"
                />
              </div>

              <div className="messageWrapper">
                <label htmlFor="message" className="messageLabel label">
                  Your message
                </label>
                <textarea
                  className="message"
                  required
                  onBlur={() => handleBlur(".message", ".messageLabel", "10px")}
                  onFocus={() => handleFocus(".messageLabel", "-11px")}
                  id="message"
                  name="message"
                ></textarea>
              </div>

              <button className="btn">Send</button>
            </form>
            <div className="loading"></div>
            <p className="emailstatus">{emailStatus}</p>
            <p className="emailRestriction">
              You have to wait {timer} seconds to send another message.
            </p>
          </div>
        </div>

        <div className="footer">
          <h1 className="logo">
            <HashLink to="/#top">
              JustTyp<span></span>
            </HashLink>
          </h1>

          <p className="rights">© JustType 2021, All rights reserved</p>

          <div className="links">
            <Link to="/terms-and-conditions">Terms and Conditions</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>

          <div className="footer_buttons">
            <Link to="/sign-in">
              <button className="footerButton sign">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="signinIcon"
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
                <p>Sign In</p>
              </button>
            </Link>

            <Link to="/sign-up">
              <button className="footerButton join">
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
                  <circle cx="9" cy="7" r="4" />
                  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  <path d="M16 11h6m-3 -3v6" />
                </svg>
                <p>Join</p>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
