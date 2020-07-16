import React from "react";

import { GRAPHQL_SERVER_URL } from "./config";

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
  useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/link-context";

const cache = new InMemoryCache();
const httpLink = new HttpLink({ uri: GRAPHQL_SERVER_URL });

const authLink = setContext((_, { headers }) => {
  const { user } = cache.readQuery({ query: LOCAL_APP_STATE });
  return {
    headers: {
      ...headers,
      authorization: user ? `Bearer ${user.authToken}` : "",
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

export const LOCAL_APP_STATE = gql`
  query localAppState {
    component @client {
      name
      props
    }
    user @client {
      name
      authToken
    }
  }
`;

// This function can be used with 1 or more
// state elements. For example:
// const user = useLocalAppState('user');
// const [component, user] = useLocalAppState('component', 'user');
export const useLocalAppState = (...stateMapper) => {
  const { data } = useQuery(LOCAL_APP_STATE);
  if (stateMapper.length === 1) {
    return data[stateMapper[0]];
  }
  return stateMapper.map((element) => data[element]);
};

// This function shallow-merges a newState object
// with the current local app state object
export const setLocalAppState = (newState) => {
  if (newState.component) {
    newState.component.props = newState.component.props ?? {};
  }
  const currentState = cache.readQuery({
    query: LOCAL_APP_STATE,
  });
  const updateState = () => {
    cache.writeQuery({
      query: LOCAL_APP_STATE,
      data: { ...currentState, ...newState },
    });
  };
  if (newState.user || newState.user === null) {
    client.onResetStore(updateState);
    client.resetStore();
  } else {
    updateState();
  }
};

// This is a component that can be used in place of
// HTML anchor elements to navigate between pages
// in the single-page app. The `to` prop is expected to be
// a React component (like `Home` or `TaskPage`)
export const AppLink = ({ children, to, ...props }) => {
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

const initialLocalAppState = {
  component: { name: "Home", props: {} },
  user: JSON.parse(window.localStorage.getItem("azdev:user")),
};

cache.writeQuery({
  query: LOCAL_APP_STATE,
  data: initialLocalAppState,
});
