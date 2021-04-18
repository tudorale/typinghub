import React, { useEffect, useState } from "react";
import "../style/css/main.css";
import Nav from "./Navs/LoggedNav";
import Firebase, { db } from "./services/Firebase";
import NotLogged from "./subComponents/NotLogged";
import HTML from "./subComponents/Html";

function AccountSettings() {
  const [user, setUser] = useState<any>(undefined);
  const [userData, setUserData] = useState<any>("");

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
        let content = document.querySelector(
          ".accountSettingsWrapper"
        ) as HTMLDivElement;
        let spinner = document.querySelector(
          ".networkSpinner"
        ) as HTMLDivElement;
        spinner.style.display = "none";
        content.style.display = "block";

        db.collection("users")
          .doc(usr.uid)
          .onSnapshot(
            {
              includeMetadataChanges: true,
            },
            (result) => {
              setUserData(result.data());
            }
          );
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

  const handleUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // one time only to change username for non-pro members
    let spinner = document.querySelector(".loadingSpinner") as HTMLDivElement;
    let RegExpression = /^[a-zA-Z0-9 _\s]*$/;
    if (!userData.changedUsername) {
      spinner.style.display = "block";

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
              if (usernames.includes(newUsername)) {
                setUsernameStatus("This username is already in use.");
                spinner.style.display = "none";
              } else {
                currentUser
                  ?.updateProfile({
                    displayName: newUsername,
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
                  username: newUsername,
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
    } else {
      if (!userData.pro) {
        setUsernameStatus(
          "You can not change your username, you already did that."
        );
      }
      if (userData.pro) {
        if (RegExpression.test(newUsername)) {
          if (newUsername.length >= 4 && newUsername.length <= 20) {
            spinner.style.display = "block";

            db.collection("users")
              .get()
              .then((user) => {
                user.forEach((data) => {
                  usernames.push(data.data().username);
                });
              })
              .then(() => {
                if (usernames.includes(newUsername)) {
                  setUsernameStatus("This username is already in use.");
                  spinner.style.display = "none";
                } else {
                  currentUser
                    ?.updateProfile({
                      displayName: newUsername,
                    })
                    .then(() => {
                      spinner.style.display = "none";
                      setUsernameStatus("Your username has been changed.");
                    })
                    .catch((err) => {
                      spinner.style.display = "none";
                      setUsernameStatus(err.message);
                    });
                  db.collection("users").doc(user.uid).update({
                    username: newUsername,
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

  const deleteAccount = () => {
    window.location.href = "/delete-account";
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
            storageRef.getDownloadURL().then((url) => {
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
      <HTML title="JustType - Account settings" />

      <div className="networkSpinner"></div>

      <div className="accountSettingsWrapper">
        <Nav path="/play" name="Main" />
        <div className="subWrapper">
          <h1>Your account</h1>
          <p>
            Username: <span>{user ? user.displayName : "Loading..."}</span>
          </p>
          <p>
            Keyboard layout:{" "}
            <span>{userData ? userData.keyboardLayout : "Loading..."}</span>
          </p>
          <p>
            Email: <span>{user ? user.email : "Loading..."}</span>
          </p>
          <p>
            Created on:{" "}
            <span>{user ? user.metadata.creationTime : "Loading..."}</span>
          </p>
          <p>
            Last login:{" "}
            <span>{user ? user.metadata.lastSignInTime : "Loading..."}</span>
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
          </div>

          <p className="description">
            Description:{" "}
            <span>{userData ? userData.description : "Loading..."}</span>
          </p>
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
            <option>Not set</option>
            <option value="QWERTY">QWERTY</option>
            <option value="Dvorak">Dvorak</option>
            <option value="AZERTY">AZERTY</option>
            <option value="Colemak">Colemak</option>
            <option value="Workman">Workman</option>
            <option value="Neo">Neo</option>
            <option value="BÉPO">BÉPO</option>
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
                  {userData
                    ? !userData.pro
                      ? userData.changedUsername
                        ? "(Used)"
                        : "(1 time)"
                      : "(Unlimited)"
                    : ""}
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
                If you want to delete your JustType account press the button
                below, by pressing that button you will be redirected to a
                special page, from that page you will delete your account and
                your data will be deleted from our databse, if you want to play
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

      <NotLogged />
    </>
  );
}

export default AccountSettings;
