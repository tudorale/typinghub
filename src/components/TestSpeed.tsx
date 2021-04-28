import React, { useEffect, useState } from "react";
import NotLogged from "./subComponents/NotLogged";
import "../style/css/main.css";
import Nav from "./Navs/LoggedNav";
import Firebase, { db } from "./services/Firebase";
import { Link } from "react-router-dom";
import HTML from "./subComponents/Html";

const Battle = React.memo((props: any) => {
  const randomWords = require("random-words");
  const axios = require("axios");

  const category = props.match.params.category;
  let HEADER;

  if (category === "random") {
    HEADER = "Random"; // 20-40
  } else if (category === "quotes") {
    HEADER = "Quotes"; // 60-80
  } else if (category === "custom") {
    HEADER = "Custom"; // 20-40
  } else {
    HEADER = category;
  }

  const [user, setUser] = useState<any>("");
  const [userData, setUserData] = useState<any>("");
  const [countdown, setCountdown] = useState<number>(5);
  const [timer, setTimer] = useState<number>(60);
  const [userInput, setUserInput] = useState<string>("");

  const [symbols, setSymbols] = useState<number>(0);
  const [wrongSymbols, setWrongSymbols] = useState<number>(0);
  const [allSymbols, setAllSymbols] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(1);

  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [displayPoints, setDisplayPoints] = useState(0);
  const [resultStatus, setResultStatus] = useState<string>(
    "Race finished, below you have your statistics."
  );
  const [randomTip, setRandomTip] = useState<string>("");

  const [quote, setQuote] = useState<string>("Loading...");

  const tips = [
    "You can use CTRL + Backspace (Win) to delete a whole word.",
    "Try to type without looking at the keyboard, look at your screen, you will type faster!",
    "Use your all 10 fingers when you type, you will type faster.",
    "Is better to type correctly and a bit slower than wrong and faster.",
    "If you have to type an uppercase letter use SHIFT + key instead of CapsLock.",
    "Maintain a good and a comfortable position of your body.",
    "Place your hands on the home row of the keyboard, hand placement is important.",
    "Stretch your hands, shoulders, your neck and don't be tired, you will type easier.",
    "Scan the text in advance with one or two words.",
  ];

  const [quoteData, setQuoteData] = useState<any>({});

  const [customText, setCustomText] = useState("");
  const [customError, setCustomError] = useState("");

  function randomPoints(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    setRandomTip(tips[Math.floor(Math.random() * 9)]);

    Firebase.auth().onAuthStateChanged((usr: any) => {
      let spinner = document.querySelector(".battleSpinner") as HTMLDivElement;
      let mustLogged = document.querySelector(".notLoggedIn") as HTMLDivElement;

      if (usr) {
        setUser(usr);

        db.collection("users")
          .doc(usr.uid)
          .onSnapshot(
            {
              includeMetadataChanges: true,
            },
            (doc: any) => {
              setUserData(doc.data());
            }
          );

        if (category === "random") {
          setQuote(randomWords({ exactly: randomPoints(20, 25), join: " " }));
        }

        if (category === "quotes") {
          axios
            .get("https://api.quotable.io/random")
            .then((res: any) => {
              setQuote(res.data.content);
              setQuoteData(res.data);
            })
            .catch((err: any) => {
              console.log("An error has occured: ", err);
            });
        }

        if (!started) {
          if (category === "custom" && quote === "Loading...") {
            setQuote("Waiting for text");
            let countdown = document.querySelector(
              ".countdown"
            ) as HTMLHeadingElement;
            countdown.style.display = "none";
            setCountdown(5);
          } else {
            id.current = setInterval(() => {
              setCountdown((s) => s - 1);
            }, 1000);
          }
        }

        if (spinner) {
          spinner.style.display = "none";
        }
      } else {
        if (spinner && mustLogged) {
          spinner.style.display = "none";
          mustLogged.style.display = "block";
        }
      }
    });
  }, []);

  // start the test
  const id = React.useRef<any>();
  const idTimer = React.useRef<any>();
  const idSeconds = React.useRef<any>();

  const clear = () => {
    clearInterval(id.current);

    if (quote !== "Loading...") {
      let test = document.querySelector(".testWrapper") as HTMLDivElement;
      let input = document.querySelector("#text") as HTMLInputElement;
      let countdown = document.querySelector(".countdown")! as HTMLHeadElement;

      if (test) {
        test.style.opacity = "1";
        test.style.filter = "blur(0px)";
      }
      if (input) {
        input.removeAttribute("disabled");
        input.focus();
      }

      if (countdown) {
        countdown.style.display = "none";
      }

      idTimer.current = setInterval(() => {
        setTimer((time) => time - 1);
      }, 1000);
    }
  };

  const startTimer = () => {
    idSeconds.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  };

  useEffect(() => {
    if (countdown === 0) {
      clear();
    }
  }, [countdown]);

  useEffect(() => {
    if (timer === 0) {
      // test finished.
      finishedRace();
      setResultStatus("Time's up, below you have your statistics");
    }
  }, [timer]);

  useEffect(() => {
    if (started) {
      startTimer();
    }
  }, [started]);

  let givenPoints = 0;
  let date = new Date();
  let h = date.getHours();
  let min = date.getMinutes();
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();

  const categoryRandom = () => {
    wpm <= 30 ? (givenPoints = 5) : (givenPoints = randomPoints(20, 40));

    setDisplayPoints(givenPoints);

    db.collection("users")
      .doc(user.uid)
      .update({
        points: userData.points + givenPoints,
        randomTests:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? userData.randomTests + 1
            : userData.randomTests,
        races:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? userData.races + 1
            : userData.races,
        lastWPM:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? wpm
            : userData.lastWPM,
        bestWPM:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? wpm > userData.bestWPM
              ? wpm
              : userData.bestWPM
            : userData.bestWPM,
        randomHistory:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? [
                ...userData.randomHistory,
                { wpm: wpm, time: `${h}:${min} ${d}/${m}/${y}` },
              ]
            : userData.randomHistory,
      });
  };

  const categoryQuotes = () => {
    wpm <= 50 ? (givenPoints = 5) : (givenPoints = randomPoints(50, 80));

    setDisplayPoints(givenPoints);

    db.collection("users")
      .doc(user.uid)
      .update({
        points: userData.points + givenPoints,
        quotesTests:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? userData.quotesTests + 1
            : userData.quotesTests,
        races:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? userData.races + 1
            : userData.races,
        lastWPM:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? wpm
            : userData.lastWPM,
        bestWPM:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? wpm > userData.bestWPM
              ? wpm
              : userData.bestWPM
            : userData.bestWPM,
        quotesHistory:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? [
                ...userData.quotesHistory,
                { wpm: wpm, time: `${h}:${min} ${d}/${m}/${y}` },
              ]
            : userData.quotesHistory,
      });
  };

  const categoryCustom = () => {
    wpm <= 30 ? (givenPoints = 5) : (givenPoints = randomPoints(20, 40));

    setDisplayPoints(givenPoints);

    db.collection("users")
      .doc(user.uid)
      .update({
        points: userData.points + givenPoints,
        customTests:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? userData.customTests + 1
            : userData.customTests,
        races:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? userData.races + 1
            : userData.races,
        lastWPM:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? wpm
            : userData.lastWPM,
        bestWPM:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? wpm > userData.bestWPM
              ? wpm
              : userData.bestWPM
            : userData.bestWPM,
        customHistory:
          Math.round((symbols / allSymbols) * 100) >= 70
            ? [
                ...userData.customHistory,
                { wpm: wpm, time: `${h}:${min} ${d}/${m}/${y}` },
              ]
            : userData.customHistory,
      });
  };

  const finishedRace = () => {
    setFinished(true);

    clearInterval(idSeconds.current);
    clearInterval(idTimer.current);

    let result = document.querySelector(".result") as HTMLDivElement;
    let speedSection = document.querySelector(
      ".neededWrapper"
    ) as HTMLDivElement;
    let input = document.querySelector("#text") as HTMLInputElement;

    if (input) {
      input.blur();
      input.setAttribute("disabled", "");
      input.setAttribute("readonly", "");
      input.setAttribute("maxlength", "0");
    } else {
      return null;
    }

    if (result && speedSection) {
      result.style.display = "block";
      speedSection.style.opacity = "0.5";
      speedSection.style.filter = "blur(2px)";
    }

    let testOver = document.querySelector(".testOver") as HTMLDivElement;
    if (testOver) {
      testOver.style.display = "block";
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!finished) {
      setUserInput(e.target.value);
      setAllSymbols((s) => s + 1);
      setStarted(true);
    }
  };

  const correctSymbols = (v: string) => {
    const text = quote;
    return v.split("").filter((s: string, i: number) => s === text[i]).length;
  };

  const checkWrongSymbols = (v: string) => {
    const text = quote;
    return v.split("").filter((s: string, i: number) => s !== text[i]).length;
  };

  let CORRECT_COLOR: string = "#7e41da";
  let WRONG_COLOR: string = "red";

  const isFinished = (value: string) => {
    if (!finished) {
      if (value.length === quote.length) {
        finishedRace();
      }
    }
  };

  useEffect(() => {
    setSymbols(correctSymbols(userInput));
    setWpm(Math.round(symbols / 5 / (seconds / 60)));
    setCpm(Math.round((symbols / seconds) * 60));

    setWrongSymbols(checkWrongSymbols(userInput));
    isFinished(userInput);
  }, [userInput]);

  useEffect(() => {
    if (finished) {
      if (category === "random") {
        categoryRandom();
      } else if (category === "quotes") {
        categoryQuotes();
      } else if (category === "custom") {
        categoryCustom();
      }
    }
  }, [wpm, finished]);

  const handleCustomText = () => {
    let content = document.querySelector(".customText") as HTMLDivElement;
    let textarea = document.querySelector("#custom") as HTMLTextAreaElement;
    let btn = document.querySelector("#btn") as HTMLButtonElement;
    let countdown = document.querySelector(".countdown") as HTMLHeadingElement;

    const regEx = /^[a-zA-Z0-9\.\,\;\?\'\"\(\)\!\$\-\& \s]*$/;

    if (customText.length >= 100 && customText.length <= 250) {
      if (regEx.test(customText)) {
        setQuote(customText);
        btn.setAttribute("disabled", "");
        textarea.setAttribute("readonly", "");
        countdown.style.display = "block";
        content.style.display = "none";
        setTimeout(() => {
          id.current = setInterval(() => {
            setCountdown((s) => s - 1);
          }, 1000);
        }, 500);
      } else {
        setCustomError(
          "You can only use lowercase, uppercase letters, numbers, punctuation and some symbols such as: () ? ! - $ & "
        );
      }
    } else {
      setCustomError(
        "The text length must be at least 100 characters and max 250 characters."
      );
    }
  };

  const newTest = () => {
    window.location.reload();
  };

  return (
    <>
      <HTML title="JustType - Test your speed" />

      {category === "random" ||
      category === "quotes" ||
      category === "custom" ? (
        <>
          <div className="battleSpinner"></div>
          {user ? (
            <div className="battleExtraWrapper">
              <Nav path="/play" name="Main" />
              <div className="battleWrapper">
                {category === "custom" ? (
                  <div className="customText">
                    <p>
                      Enter your text below, make sure you follow the rules of
                      characters; min = 100, max = 250.
                    </p>
                    <textarea
                      onChange={(e) => {
                        setCustomText(e.target.value);
                        setCustomError("");
                      }}
                      maxLength={250}
                      minLength={150}
                      id="custom"
                    ></textarea>
                    <button id="btn" onClick={handleCustomText}>
                      Go
                    </button>
                    <p className="lengthText">{customText.length}/250</p>
                    <p>{customError}</p>
                  </div>
                ) : (
                  ""
                )}

                <h1 className="countdown">{countdown}</h1>

                <div className="testWrapper">
                  <div className="neededWrapper">
                    <div className="quote">
                      {quote.split("").map((word, index) => {
                        let color;
                        if (index < userInput.length) {
                          color =
                            word === userInput[index]
                              ? CORRECT_COLOR
                              : WRONG_COLOR;

                          if (word === " ") {
                            if (userInput[index] !== word) {
                              word = userInput[index];
                            }
                          }
                        }

                        if (index === userInput.length) {
                          return (
                            <span
                              key={index}
                              className={"word"}
                              style={{
                                color: color,
                                fontWeight: 700,
                                textDecoration: "underline",
                              }}
                            >
                              {word === " " ? " " : word}
                            </span>
                          );
                        }

                        return (
                          <span
                            key={index}
                            className={"word"}
                            style={{ color: color }}
                          >
                            {word === " " ? " " : word}
                          </span> // is weird isn't it? is not a normal space is &nbsp; using alt + 2 2 5
                        );
                      })}
                    </div>

                    <input
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      id="text"
                      maxLength={quote.length}
                      onChange={handleInput}
                      disabled
                      type="text"
                      autoComplete="off"
                      placeholder={"Start typing the text above"}
                    />

                    <div className="leftInfo">
                      <p className="category">Category: {HEADER}</p>
                      <p className="features">
                        {category == "random" && "Random words"}
                        {category == "quotes" &&
                          "Lowercase, uppercase words, punctuation"}
                        {category == "custom" &&
                          "Allowed lowercase, uppercase words, punctuation, symbols"}
                      </p>
                      <p className="account">
                        Account: {user ? user.displayName : "Loading..."},{" "}
                        {userData ? userData.points : "Loading"} Points,{" "}
                        {userData ? userData.rank : "Loading..."}
                      </p>
                    </div>

                    <div className="rightInfo">
                      <p className="timeleft">{timer}</p>
                      <p className="abandon">
                        <Link to="/play">Abandon</Link>
                      </p>
                    </div>
                  </div>

                  <p className="randomTip">Random Tip: {randomTip}</p>

                  <div className="testOver">
                    <p>This test is over.</p>
                    <div className="testOverButtons">
                      <button onClick={newTest}>New test on {HEADER}</button>

                      <Link to="/play">
                        <button>Go home</button>
                      </Link>
                    </div>
                  </div>

                  <div className="result">
                    <h1>{resultStatus}</h1>
                    <p className="givenPoints">
                      <span>+{displayPoints}</span> points. Total points:{" "}
                      <span>
                        {userData ? userData.points : "Calculating.."}
                      </span>
                    </p>
                    <p className="infoResult">
                      {displayPoints === 5
                        ? `You have to get over 
                          ${category === "random" ? "30" : ""}
                          ${category === "quotes" ? "50" : ""}
                          ${category === "custom" ? "30" : ""}
                                                            
                          WPM for this category to get the normal amount of points.`
                        : null}
                    </p>
                    <p className="notAllowed">
                      {Math.round((symbols / allSymbols) * 100) <= 70
                        ? "You have an accuracy that is less than 70%, your score will not be saved."
                        : ""}
                    </p>
                    <p>
                      Category of the test: <span>{HEADER}</span>
                    </p>
                    <p>
                      WPM (Words Per Minute): <span>{!wpm ? "0" : wpm}</span>
                    </p>
                    <p>
                      CPM (Characters Per Minute):{" "}
                      <span>{!cpm ? "0" : cpm}</span>
                    </p>
                    <p>
                      Text typed in: <span>{seconds} seconds</span>
                    </p>
                    <p>
                      Time left: <span>{timer} seconds</span>
                    </p>
                    <p>
                      Correct symbols: <span>{symbols}</span>
                    </p>
                    <p>
                      Wrong symbols on text: <span>{wrongSymbols}</span>
                    </p>
                    <p>
                      Accuracy:{" "}
                      <span>
                        {!Math.round((symbols / allSymbols) * 100)
                          ? "0"
                          : Math.round((symbols / allSymbols) * 100)}
                        %
                      </span>
                    </p>
                    <p>
                      Total keystrokes: <span>{allSymbols}</span>
                    </p>
                    <p>
                      Text length: <span>{quote.length}</span> characters
                      (including spaces)
                    </p>
                    <p>
                      Unnecessary keystrokes:{" "}
                      <span>
                        {allSymbols > quote.length
                          ? allSymbols - quote.length
                          : "0"}
                      </span>
                    </p>
                    {category === "quotes" ? (
                      <p>
                        A quote from: <span>{quoteData.author}</span>
                      </p>
                    ) : (
                      ""
                    )}
                    <p style={{ marginTop: "20px" }}>
                      <Link to="/info">How we do it & Good to know</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <NotLogged />
          )}
        </>
      ) : (
        <p className="categoryNotExist">
          This category ({category}) does not exist, sorry!{" "}
          <a href="/play">Play</a>
        </p>
      )}
    </>
  );
});

export default Battle;
