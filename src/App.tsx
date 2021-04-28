import React, { Suspense } from "react";
import "./style/css/main.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  const Home = React.lazy(() => import("./components/Home"));
  const SignUp = React.lazy(() => import("./components/auth/SignUp"));
  const SignIn = React.lazy(() => import("./components/auth/SignIn"));
  const Recover = React.lazy(() => import("./components/auth/RecoverPassword"));
  const Terms = React.lazy(() => import("./components/law/Terms"));
  const Privacy = React.lazy(() => import("./components/law/Privacy"));
  const Play = React.lazy(() => import("./components/Play"));
  const AccountSettings = React.lazy(
    () => import("./components/AccountSettings")
  );
  const Profile = React.lazy(() => import("./components/Profile"));
  const User = React.lazy(() => import("./components/User"));
  const TestSpeed = React.lazy(() => import("./components/TestSpeed"));
  const DeleteAccount = React.lazy(() => import("./components/DeleteAccount"));
  const Page404 = React.lazy(() => import("./components/404"));
  const Info = React.lazy(() => import("./components/Info"));
  const Pro = React.lazy(() => import("./components/Pro"));

  return (
    <Suspense fallback={<div className="spinner"></div>}>
      <div className="website">
        <Router>
          <Switch>
            <Route path="/profile" exact component={Profile} />
            <Route exact path="/user/:username" component={User} />
            <Route exact path="/speed/:category" component={TestSpeed} />
            <Route exact path="/info" component={Info} />
            <Route exact path="/pro" component={Pro} />
            <Route path="/play" exact component={Play} />
            <Route path="/account-settings" exact component={AccountSettings} />

            <Route path="/" exact component={Home} />
            <Route path="/sign-up" exact component={SignUp} />
            <Route path="/sign-in" exact component={SignIn} />
            <Route path="/recover-password" exact component={Recover} />
            <Route path="/terms-and-conditions" exact component={Terms} />
            <Route path="/privacy-policy" exact component={Privacy} />
            <Route path="/delete-account" exact component={DeleteAccount} />
            <Route component={Page404} />
          </Switch>
        </Router>
      </div>
    </Suspense>
  );
}

export default App;
