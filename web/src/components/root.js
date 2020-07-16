import React from "react";
import { ApolloProvider } from "@apollo/client";

import { client, useLocalAppState } from "../store";

import * as mainComponents from "./index";
import Navbar from "./navbar";

function MainRouter() {
  const [component, user] = useLocalAppState("component", "user");
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
  return (
    <ApolloProvider client={client}>
      <MainRouter />
    </ApolloProvider>
  );
}
