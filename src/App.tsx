import React, { Suspense } from "react";
import "./style/css/main.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import * as Component from "./LazyComponents"


function App() {
  
  return (
    <Suspense fallback={<div className="spinner"></div>}>
      <div className="website">
        <Router>
          <Switch>
            <Route path="/profile" exact component={Component.Profile} />
            <Route exact path="/user/:username" component={Component.User} />
            <Route exact path="/speed/:category" component={Component.TestSpeed} />
            <Route exact path="/info" component={Component.Info} />
            <Route exact path="/pro" component={Component.Pro} />
            <Route path="/play" exact component={Component.Play} />
            <Route path="/account-settings" exact component={Component.AccountSettings} />

            <Route path="/" exact component={Component.Home} />
            <Route path="/sign-up" exact component={Component.SignUp} />
            <Route path="/sign-in" exact component={Component.SignIn} />
            <Route path="/recover-password" exact component={Component.Recover} />
            <Route path="/terms-and-conditions" exact component={Component.Terms} />
            <Route path="/privacy-policy" exact component={Component.Privacy} />
            <Route path="/delete-account" exact component={Component.DeleteAccount} />
            <Route path="/admin-panel" exact component={Component.AdminPanel} />
            <Route component={Component.Page404} />
          </Switch>
        </Router>
      </div>
    </Suspense>
  );
}

export default App;
