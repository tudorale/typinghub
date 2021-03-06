import React, { useEffect, useState, useContext } from "react";
import "../style/css/main.css";
import Nav from "./Navs/LoggedNav";
import Firebase, { db } from "./services/Firebase";
import NotLogged from "./subComponents/NotLogged";
import HTML from "./subComponents/Html";
import { useHistory } from "react-router-dom";
import UserContext from "./services/UserContext";
import * as config from "../config.json";

function AccountSettings() {
  const userStatus = useContext(UserContext);
  const { user, setUser, userData, setUserData } = userStatus;

  const [newUsername, setNewUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const [newPassowrd, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const [imageStatus, setImageStatus] = useState("");

  const [description, setDescription] = useState("");
  const [descriptionStatus, setDescriptionStatus] = useState("");

  const [image, setImage] = useState<any>("");
  const [layoutStatus, setLayoutStatus] = useState<string>("");

  useEffect(() => {
    Firebase.auth().onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);

        let spinner = document.querySelector(
          ".networkSpinner"
        ) as HTMLDivElement;
        spinner.style.display = "none";
        
        db.collection("users")
          .doc(usr.uid)
          .get()
          .then((doc: any) => {
            setUserData(doc.data());
          })

      } else {
        let contentNot = document.querySelector(
          ".notLoggedIn"
        ) as HTMLDivElement;

        let spinner = document.querySelector(
          ".networkSpinner"
        ) as HTMLDivElement;
        
        spinner.style.display = "none";
        contentNot.style.display = "block";
      }
    });
  }, []);

  // ui functions

  const handleFocus = (
    i: string,
    l: string,
    pxUp: string,
    inputHeight: string,
    f: string
  ) => {
    let input = document.querySelector(i) as HTMLInputElement;
    let label = document.querySelector(l) as HTMLLabelElement;

    input.style.height = `${inputHeight}px`;
    label.style.top = `${pxUp}px`;
    label.style.fontSize = `${f}rem`;
  };

  const handleBlur = (i: string, l: string, value: any) => {
    let input = document.querySelector(i) as HTMLInputElement;
    let label = document.querySelector(l) as HTMLLabelElement;

    if (value === "") {
      input.style.height = `40px`;
      label.style.top = `30px`;
      label.style.fontSize = `1rem`;
    }
  };

  const handleFocusDescription = (
    i: string,
    l: string,
    pxUp: string,
    f: string
  ) => {
    let label = document.querySelector(l) as HTMLLabelElement;

    label.style.marginTop = `${pxUp}px`;
    label.style.fontSize = `${f}rem`;
  };

  const handleBlurDescription = (l: string, pxUp: string, value: any) => {
    let label = document.querySelector(l) as HTMLLabelElement;

    if (value === "") {
      label.style.marginTop = `${pxUp}`;
      label.style.fontSize = `1rem`;
    }
  };

  // variable just for account settings
  const currentUser = Firebase.auth().currentUser;

  // all usernames from the databse
  let usernames: any[] = [];

  let Filter = require("bad-words"),
    filter = new Filter();

  const handleUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // one time only to change username for non-pro members

    let spinner = document.querySelector(".loadingSpinner") as HTMLDivElement;
    let RegExpression = /^[a-zA-Z0-9 _\s]*$/;

    const changeIt = () => {
 
      // security checkers
      if (RegExpression.test(newUsername)) {

        if (newUsername.length >= 4 && newUsername.length <= 20) {
          db.collection("users")
            .get()
            .then((user) => {
              user.forEach((data) => {
                usernames.push(data.data().username);
              });
            })
            .then(() => {
              if (usernames.includes(newUsername) || usernames.includes(newUsername.toLowerCase()) || usernames.includes(newUsername.toUpperCase())) {
                setUsernameStatus("This username is already in use.");
                spinner.style.display = "none";
              } else {
                currentUser
                  ?.updateProfile({
                    displayName: filter.clean(newUsername),
                  })
                  .then(() => {
                    spinner.style.display = "none";
                    setUsernameStatus("Your username has been changed.");
                  })
                  .then(() => {
                    db.collection("users").doc(currentUser?.uid).update({
                      changedUsername: true,
                    });
                  })
                  .catch((err) => {
                    spinner.style.display = "none";
                    setUsernameStatus(err.message);
                  });

                db.collection("users").doc(user.uid).update({
                  username: filter.clean(newUsername),
                });
              }
            });
        } else {
          setUsernameStatus(
            "Your username must be more than 4 characters and less than 20 characters."
          );
        }
      
      } else {
        setUsernameStatus(
          "Invalid username, use only letters, numbers and underscores"
        );
      }
    }

    // check if the user already changed their name
    if (!userData.changedUsername) {
      spinner.style.display = "block";

      changeIt();

    }else { // if he did change his username before

      spinner.style.display = "block";

      if (!userData.pro) { // if he doesn't have pro, cannot change
        setUsernameStatus(
          "You can not change your username, you already did that."
        );
      }

      if (userData.pro) { // if he has pro he can change it whenever he/she wants
        changeIt();
      }
    }
  };

  const handleEmail = (e: React.FormEvent<HTMLFormElement>) => {
    let emailSpinner = document.querySelector(
      ".emailSpinner"
    ) as HTMLDivElement;
    emailSpinner.style.display = "block";
    e.preventDefault();
    currentUser
      ?.updateEmail(newEmail)
      .then(() => {
        emailSpinner.style.display = "none";
        setEmailStatus("Your email has been changed.");
      })
      .catch((error) => {
        emailSpinner.style.display = "none";
        setEmailStatus(error.message);
      });
  };

  const handlePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let passwordSpinner = document.querySelector(
      ".passwordSpinner"
    ) as HTMLDivElement;
    passwordSpinner.style.display = "block";

    currentUser
      ?.updatePassword(newPassowrd)
      .then(() => {
        passwordSpinner.style.display = "none";
        setPasswordStatus("Your password has been changed.");
      })
      .catch((error) => {
        passwordSpinner.style.display = "none";
        setPasswordStatus(error.message);
      });
  };

  const history = useHistory();

  const deleteAccount = () => {
    history.push("/delete-account");
  };

  const handleImage = (e: any) => {
    let file = e.target.files[0];
    setImage(file);
    setImageStatus("");
  };

  const handleSetImage = () => {
    if (image !== "") {
      setImageStatus("Checking your image...");
      if (image.size <= 5 * 1024 * 1024) {
        if (!image.type.startsWith("image/")) {
          setImageStatus(
            "That file is not a image for sure, please upload an image."
          );
        } else {
          let storageRef = Firebase.storage().ref(
            "users/" + `${currentUser?.uid}/` + `${image.name}`
          );
          let allImages = Firebase.storage()
            .ref()
            .child(`users/` + currentUser?.uid);

          storageRef.put(image).then(() => {
            setImageStatus("Uploading...");
            storageRef.getDownloadURL().then( async (url) => {

              let imageURL = url;

              db.collection("users").doc(currentUser?.uid).update({
                profileImage: url,
              });

              currentUser
                ?.updateProfile({
                  photoURL: imageURL,
                })
                .then(() => {
                  setImage("");
                  setImageStatus(
                    "Your profile image was changed. It might take a few seconds to update."
                  );
                });
            });

            allImages.listAll().then((res) => {
              let files = res.items;
              for (let i = 0; i < files.length; i++) {
                if (files[i].name !== image.name) {
                  files[i].delete().then(() => {
                    console.log("done");
                  });
                }
              }
            });
          });
        }
      } else {
        setImageStatus("The image must be less than 5MB");
      }
    } else {
      setImageStatus("Select an image");
    }
  };

  const handleResetImage = () => {
    let allImages = Firebase.storage().ref().child(`users/` + currentUser?.uid);
    
    if(userData.profileImage === config.profileURL){
      setImageStatus("You have to set an image before reseting it.")
    }else{

      // delete every image from his storage
      allImages.listAll().then((res) => {
        let files = res.items;
        for (let i = 0; i < files.length; i++) {
          files[i].delete().then(() => {
            console.log("done")
          });         
        }
      });

      // updating with the default TypingHub image
      currentUser
        ?.updateProfile({
          photoURL: config.profileURL,
        })
        .then(() => {
          setImage("");
          setImageStatus(
            "Your profile image was reseted, it may take a few seconds to update."
          );
        });

      db.collection("users").doc(currentUser?.uid).update({
        profileImage: config.profileURL,
      });
    }

  }

  const handleDescription = () => {
    if (description !== "") {
      let spinner = document.querySelector(
        ".descriptionSpinner"
      ) as HTMLDivElement;
      spinner.style.display = "block";
      if (description.length <= 250) {
        db.collection("users")
          .doc(currentUser?.uid)
          .update({
            description: description,
          })
          .then(() => {
            spinner.style.display = "none";
            setDescriptionStatus("Your description has been changed");
          })
          .catch((err) => {
            spinner.style.display = "none";
            setDescriptionStatus(err.message);
          });
      } else {
        setDescriptionStatus(
          "Your description must be less than 250 characters"
        );
      }
    } else {
      setDescriptionStatus("Your description can not be blank.");
    }
  };

  const keyboardLayout = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayoutStatus("Setting your layout...");

    db.collection("users")
      .doc(currentUser?.uid)
      .update({
        keyboardLayout: e.target.value,
      })
      .then(() => {
        setLayoutStatus("Done");
      })
      .catch((err) => {
        setLayoutStatus(err.message);
      });
  };

  return (
    <>
      <HTML title={`${config.name} | Account settings`} />

      <div className="networkSpinner"></div>

      {
        userData && user ?
          <div className="accountSettingsWrapper">
        <Nav path="/play" name="Main" />
        <div className="subWrapper">
          <h1>Your account</h1>
          <p>
            Username: <span>{user.displayName}</span>
          </p>
          <p>TypingHub Role: <span>{userData.role === "admin" ? "Admin" : "User"}</span></p>
          <p>
            Keyboard layout:{" "}
            <span>{userData.keyboardLayout}</span>
          </p>
          <p>
            Email: <span>{user.email}</span>
          </p>
          <p>
            Created on:{" "}
            <span>{user.metadata.creationTime}</span>
          </p>
          <p>
            Last login:{" "}
            <span>{user.metadata.lastSignInTime}</span>
          </p>

          <div className="profilePicture">
            <p>Profile Image</p>
            <img
              src={
                user
                  ? user?.photoURL
                  : "https://firebasestorage.googleapis.com/v0/b/justtype-preview.appspot.com/o/profileimage.jpg?alt=media&token=ff56cecc-ffce-42c5-8079-bcc806e70348"
              }
              className="profileImageSettings"
            />

            <p>Change your profile image(best size: 150x150)</p>
            <input type="file" className="image" onChange={handleImage} />
            <p className="status">{imageStatus}</p>
            <button onClick={() => handleSetImage()}>Change image</button>
            <button onClick={() => handleResetImage()} style={{marginLeft: "15px"}}>Reset image</button>
          </div>

         
            <p className="description">Your description</p>
          

          <label htmlFor="description" className="dLabel">
            Set description
          </label>
          <textarea
            id="description"
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionStatus("");
            }}
            
            maxLength={250}
            onFocus={() =>
              handleFocusDescription("#description", ".dLabel", "15", "0.9")
            }
            onBlur={() => handleBlurDescription(".dLabel", "20", description)}
          ></textarea>

          <p
            style={{ marginTop: "10px", marginBottom: "10px" }}
            className="status"
          >
            {descriptionStatus}
          </p>
          <div className="descriptionSpinner"></div>
          <button className="usernameButton" onClick={handleDescription}>
            Change description
          </button>

          <p>Set your keyboard layout</p>
          <select name="layouts" onChange={keyboardLayout}>
            <option>Layouts</option>
            <option value="Not Set">Not set</option>
            <option value="QWERTY">QWERTY</option>
            <option value="Dvorak">Dvorak</option>
            <option value="AZERTY">AZERTY</option>
            <option value="Colemak">Colemak</option>
            <option value="Workman">Workman</option>
            <option value="Neo">Neo</option>
            <option value="B??PO">B??PO</option>
            <option value="Other layout">Other layout</option>
            <option value="Custom layout">Custom layout</option>
          </select>
          <p
            style={{ marginTop: "15px", marginBottom: "10px" }}
            className="status"
          >
            {layoutStatus}
          </p>
          <h1 className="asHeader">Account settings</h1>
          <div className="settingsContent">
            <div className="newUsername">
              <form onSubmit={handleUsername}>
                <p>
                  Change username{" "}
                  { !userData.pro
                      ? userData.changedUsername
                        ? "(Used)"
                      : "(1 time)"
                    : "(Unlimited)"
                  }
                </p>
                <label htmlFor="username" className="newUserL">
                  New username
                </label>
                <input
                  id="username"
                  type="text"
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    setUsernameStatus("");
                  }}
                  maxLength={20}
                  minLength={4}
                  onFocus={() =>
                    handleFocus("#username", ".newUserL", "23", "55", "0.9")
                  }
                  onBlur={() =>
                    handleBlur("#username", ".newUserL", newUsername)
                  }
                />
                <p
                  style={{ marginTop: "10px", paddingRight: "20px" }}
                  className="status"
                >
                  {usernameStatus}
                </p>
                <button>Change username</button>
                <div className="loadingSpinner usernameSpinner"></div>
              </form>
            </div>

            <div className="newEmail">
              <form onSubmit={handleEmail}>
                <p>Change email</p>
                <label htmlFor="email" className="newemailL">
                  Valid email
                </label>
                <input
                  id="email"
                  type="email"
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailStatus("");
                  }}
                  onFocus={() =>
                    handleFocus("#email", ".newemailL", "23", "55", "0.9")
                  }
                  onBlur={() => handleBlur("#email", ".newemailL", newEmail)}
                />
                <p
                  style={{ marginTop: "10px", paddingRight: "20px" }}
                  className="status"
                >
                  {emailStatus}
                </p>
                <button type="submit">Change email</button>
                <div className="loadingSpinner emailSpinner"></div>
              </form>
            </div>

            <div className="newPassword">
              <form onSubmit={handlePassword}>
                <p>Change password</p>
                <label htmlFor="password" className="newpasswordL">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordStatus("");
                  }}
                  onFocus={() =>
                    handleFocus("#password", ".newpasswordL", "23", "55", "0.9")
                  }
                  onBlur={() =>
                    handleBlur("#password", ".newpasswordL", newPassowrd)
                  }
                />
                <p
                  style={{ marginTop: "10px", paddingRight: "20px" }}
                  className="status"
                >
                  {passwordStatus}
                </p>
                <button type="submit">Change password</button>
                <div className="loadingSpinner passwordSpinner"></div>
              </form>
            </div>

            <div className="deleteAccount">
              <p>
                If you want to delete your {config.name} account press the button
                below, by pressing that button you will be redirected to a
                special page, from that page you will delete your account and
                your data will be deleted from our database, if you want to play
                again and use our website you need to make a new account.
              </p>
              <p>
                For every option from above you need to be 'fresh' logged in, if
                you are not you will see an error and you have to log in again.
              </p>
              <button onClick={deleteAccount}>Delete account</button>
            </div>
          </div>
        </div>
      </div>
        :
          <NotLogged />
      }
    </>
  );
}

export default AccountSettings;
