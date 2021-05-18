import React from "react";
import "../../style/css/main.css";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

function Navigation() {
  // ui stuff
  let mobileStatus = false;

  const handleMobile = () => {
    mobileStatus = !mobileStatus;

    let mobileNav = document.querySelector(".mobileNavInfo") as HTMLDivElement;
    let effect = document.querySelector(".effectInfo") as HTMLDivElement;

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

    let mobileNav = document.querySelector(".mobileNavInfo") as HTMLDivElement;
    let effect = document.querySelector(".effectInfo") as HTMLDivElement;

    mobileNav.style.display = "none";
    effect.style.opacity = "0";
    effect.style.zIndex = "-2";
  };

  return (
    <>
      <div className="effectInfo" onClick={handleRemoveMobile}></div>
      <div className="navbarInfo">
        <h1 className="logoNavInfo">
          <HashLink to="/">
            TypingHu<span></span>
          </HashLink>
        </h1>
        <ul>
          <Link to="/">
            <li>Landing page</li>
          </Link>
          <Link to="/play">
            <li>Main page</li>
          </Link>
          <Link to="/sign-in">
            <li>Sign In</li>
          </Link>
          <Link to="/sign-in">
            <li>Create Account</li>
          </Link>
        </ul>

        <div className="hamburgerInfo" onClick={handleMobile}>
          <div className="lineInfo line1"> </div>
          <div className="lineInfo line2"> </div>
          <div className="lineInfo line3"> </div>
        </div>
      </div>

      <div className="mobileNavInfo">
        <h1 className="logoNavMobileInfo">
          <HashLink to="/">
            TypingHu<span></span>
          </HashLink>
        </h1>
        <ul>
          <Link to="/">
            <li>Landing page</li>
          </Link>
          <Link to="/play">
            <li>Main page</li>
          </Link>
          <Link to="/sign-in">
            <li>Sign In</li>
          </Link>
          <Link to="/sign-in">
            <li>Create Account</li>
          </Link>
        </ul>
      </div>
    </>
  );
}

export default Navigation;
