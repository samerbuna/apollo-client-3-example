import React, { useState } from "react";
import axios from "axios";

import { GRAPHQL_SERVER_URL } from "./config";

const initialLocalAppState = {
  component: { name: "Home", props: {} },
  user: JSON.parse(window.localStorage.getItem("azdev:user")),
};

// The useStore is a custom hook function designed
// to be used with React's context feature
export const useStore = () => {
  // This state object is used to manage
  // all local app state elements (like user/component)
  const [state, setState] = useState(() => initialLocalAppState);

  // This function can be used with 1 or more
  // state elements. For example:
  // const user = getLocalAppState('user');
  // const [component, user] = getLocalAppState('component', 'user');
  const getLocalAppState = (...stateMapper) => {
    if (stateMapper.length === 1) {
      return state[stateMapper[0]];
    }
    return stateMapper.map((element) => state[element]);
  };

  // This function shallow-merges a newState object
  // with the current local app state object
  const setLocalAppState = (newState) => {
    if (newState.component) {
      newState.component.props = newState.component.props ?? {};
    }
    setState((currentState) => {
      return { ...currentState, ...newState };
    });
  };

  // This is a component that can be used in place of
  // HTML anchor elements to navigate between pages
  // in the single-page app. The `to` prop is expected to be
  // a React component (like `Home` or `TaskPage`)
  const AppLink = ({ children, to, ...props }) => {
    const handleClick = (event) => {
      event.preventDefault();
      setLocalAppState({
        component: { name: to, props },
      });
    };
    return (
      <a href={to} onClick={handleClick}>
        {children}
      </a>
    );
  };

  // This function should make an ajax call to GraphQL server
  // and return the GraphQL response object
  const request = async (requestText, { variables } = {}) => {
    const headers = state.user
      ? { Authorization: "Bearer " + state.user.authToken }
      : {};

    const { data } = await axios.post(
      GRAPHQL_SERVER_URL,
      { query: requestText, variables },
      { headers }
    );

    return data;
  };

  // In React components, the following is the object you get
  // when you make a useActions() call
  return {
    getLocalAppState,
    setLocalAppState,
    AppLink,
    request,
  };
};

// Define React's context object and the useActions
// custom hook function that'll use it
const AZContext = React.createContext();
export const Provider = AZContext.Provider;
export const useActions = () => React.useContext(AZContext);
