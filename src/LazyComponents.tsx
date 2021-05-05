import React from "react";

export const Home = React.lazy(() => import("./components/Home"));
export const SignUp = React.lazy(() => import("./components/auth/SignUp"));
export const SignIn = React.lazy(() => import("./components/auth/SignIn"));
export const Recover = React.lazy(
  () => import("./components/auth/RecoverPassword")
);
export const Terms = React.lazy(() => import("./components/law/Terms"));
export const Privacy = React.lazy(() => import("./components/law/Privacy"));
export const Play = React.lazy(() => import("./components/Play"));
export const AccountSettings = React.lazy(
  () => import("./components/AccountSettings")
);
export const Profile = React.lazy(() => import("./components/Profile"));
export const User = React.lazy(() => import("./components/User"));
export const TestSpeed = React.lazy(() => import("./components/TestSpeed"));
export const DeleteAccount = React.lazy(
  () => import("./components/DeleteAccount")
);
export const Page404 = React.lazy(() => import("./components/404"));
export const Info = React.lazy(() => import("./components/Info"));
export const Pro = React.lazy(() => import("./components/Pro"));
