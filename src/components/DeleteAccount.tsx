import React, { useEffect, useState } from "react";
import "../style/css/main.css";
import Firebase, { db } from "./services/Firebase";
import HTML from "./subComponents/Html";

function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonStatus, setButtonStatus] = useState("Delete account");
  const [error, setError] = useState("");

  const handleDelete = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let btn = document.querySelector("#btn") as HTMLButtonElement;
    btn?.setAttribute("disabled", "");
    setButtonStatus("Loading...");
    Firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        db.collection("users")
          .doc(Firebase.auth().currentUser?.uid)
          .delete()
          .then(() => {
            // delete the storage files if he have one (profile image)
            const storageRef = Firebase.storage()
              .ref()
              .child(`users/` + Firebase.auth().currentUser?.uid);

            storageRef
              .listAll()
              .then((res) => {
                let images = res.items;
                for (let i = 0; i < images.length; i++) {
                  images[i].delete().then(() => {
                    console.log("done");
                  });
                }
              })
              .then(() => {
                Firebase.auth()
                  .currentUser?.delete()
                  .then(() => {
                    window.location.href = "/sign-up";
                  });
              });
          });
      })
      .catch((error) => {
        setButtonStatus("Delete account");
        setError(error.message);
        btn?.removeAttribute("disabled");
      });
  };

  return (
    <div>
      <HTML title="JustType - Delete your account" />
      <div className="deleteYourAccount">
        <p>
          For security purposes you will need to re-enter your credentials to
          delete your account.
        </p>

        <form onSubmit={handleDelete}>
          <input
            type="email"
            required
            placeholder="Your email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button id="btn">{buttonStatus}</button>
        </form>
        <p style={{ marginTop: "10px" }}>{error}</p>
      </div>
    </div>
  );
}

export default DeleteAccount;
