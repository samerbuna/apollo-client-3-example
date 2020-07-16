import React from "react";

import { useStore, useActions, Provider } from "../store";
import * as mainComponents from "./index";
import Navbar from "./navbar";

function MainRouter() {
  const { getLocalAppState } = useActions();
  const [component, user] = getLocalAppState("component", "user");
  const Component = mainComponents[component.name];

  return (
    <div className="route-container">
      <Navbar user={user} />
      <div className="main-component">
        <Component {...component.props} />
      </div>
    </div>
  );
}

export default function Root() {
  const store = useStore();
  return (
    <Provider value={store}>
      <MainRouter />
    </Provider>
  );
}
