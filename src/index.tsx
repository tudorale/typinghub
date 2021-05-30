import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserProvider } from "./components/services/UserContext";
import { PlayZoneProvider } from "./components/services/PlayZoneContext";

ReactDOM.render(
  <UserProvider>
    <PlayZoneProvider>
      <App />
    </PlayZoneProvider>
  </UserProvider>,
  document.getElementById("root")
);
