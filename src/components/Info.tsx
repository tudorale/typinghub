import React from "react";
import HTML from "./subComponents/Html";
import Navigation from "./Navs/InfoNav";
import "../style/css/main.css";

function Info() {
  const config = require("../config.json")
  return (
    <>
      <HTML title={`${config.name} | Informations`} />
      <Navigation />
      <div className="informations">
        <h1>{config.name} Informations, Systems, Updates</h1>
        <p>
          First of all, we are using a normal, common system for the calculation
          of your data, such as WPM, CPM, Accuracy, below on the page you will
          see how.
        </p>

        <h2>Monthly prize for the first user in the leaderboard</h2>
        <p>
          At the end of each month the first place from the leaderboard will get
          a free pro membership for a month, if the player has already pro
          membership he will get +200 points for his account. The monthly prize
          will start when in the leaderboard will be more than 7 active players.
        </p>

        <h2>Play Zone</h2>
        <p>The Play Zone is found on the main page of the platform, there you can play the custom texts from the comunity users or you can add your own text by going to the "Custom Text" category and press the button "Add to Play Zone"</p>
        <p>After you press the button, your text will be sent in a queue review, an admin will take a look at your text before publishing it to the Play Zone, we do this because someone can send inappropriate texts. A review can take up to a day.</p>  


        <h2>What data are we storing?</h2>
        <p>
          We are storing the majority of data that is displayed after a test is
          taken, to keep statistics of your playing time and your improvement,
          all the data that is stored is displayed on your profile/someone
          else's profile.
        </p>

        <h2>How we are choosing what you have to type?</h2>
        <p>
          We are using 2 APIs for your typing texts, for the random category we
          are using a free API with common English words, for the quotes
          category we are also using a free API with simple quotes. In the
          custom category, we are not storing your custom text!.
        </p>

        <h2>Method of calculation.</h2>
        <p>
          For the <span>WPM</span> we are using the formula:{" "}
          <span className="formula">
            ( correct_symbols / 5 ) / ( your_seconds / 60)
          </span>
          .
        </p>
        <p>
          In the formula, "correct_symbols" are the characters that you typed
          correctly, "your_seconds" is your typing time from the moment you
          typed a character to the end. We are using "5" as the average length
          of the words.
        </p>

        <p>
          For <span>CPM</span> we are using:{" "}
          <span className="formula">
            ( correct_symbols / your_seconds ) / 60
          </span>
          , you can found the legend above.
        </p>
        <p>
          The <span>accuracy</span> is calculated using:{" "}
          <span className="formula">(correct_symbols / all_symbols) * 100</span>
          , where "all_symbols" are all the characters in the text, we are
          dividing by 100 to found the percentage.
        </p>

        <h2>
          What is the best way to improve yourself and in what category you have
          to play?
        </h2>
        <p>
          We made 3 categories for a reason if you want to improve your speed
          and your knowledge of English words we recommend you to type in the
          "random" category. If you want to improve your correct typing and the
          usual typing with punctuation that you will find everywhere, the
          "quotes" category is best for you. And if you want to play with your
          skills and focus on only one word or a certain text more than once we
          recommend you the "custom" category, if you are playing there just to
          make a good WPM for your profile by using only one letter/word you are
          just lying to yourself, so keep that in mind.
        </p>

        <h2>{config.name} ID</h2>
        <p>
          You will see some numbers next to someone's name, like #1234, what
          does that number and why does exist?
        </p>
        <p>
          That number is what we called {config.name} ID that is unique for each
          user, with that ID you can keep track of someone's profile, for
          example if the user changes his username in the chat you will not see
          the updated name instead you will see the old one but the ID will stay
          the same and in the future we will add a friends system where you can
          add friends based on that ID.
        </p>

        <h2>Updates and the future</h2>
        <p>
          In the future, we will make different sections where users can post
          their texts and you can play on them, we will make minigames and
          challenges and a friends system, so stay tuned and check this page for
          more details.
        </p>
      </div>
    </>
  );
}

export default Info;
