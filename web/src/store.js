import React from 'react';
import { gql, useQuery, useApolloClient } from '@apollo/client';

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
// const user = useLocalQuery('user');
// const [component, user] = useLocalQuery('component', 'user');
export const useLocalQuery = (...stateMapper) => {
  const { data } = useQuery(LOCAL_APP_STATE);
  if (stateMapper.length === 1) {
    return data[stateMapper[0]];
  }
  return stateMapper.map((element) => data[element]);
};

// This function shallow-merges a newState object
// with the current local app state object
export const useLocalMutation = () => {
  const client = useApolloClient();

  return (newState) => {
    if (newState.component) {
      newState.component.props = newState.component.props ?? {};
    }
    const currentState = client.readQuery({
      query: LOCAL_APP_STATE,
    });
    const updateState = () => {
      client.writeQuery({
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
};

// This is a component that can be used in place of
// HTML anchor elements to navigate between pages
// in the single-page app. The `to` prop is expected to be
// a React component (like `Home` or `TaskPage`)
export const AppLink = ({ children, to, ...props }) => {
  const setLocalAppState = useLocalMutation();
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
