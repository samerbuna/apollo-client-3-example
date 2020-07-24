import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import fetch from 'cross-fetch';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/link-context';
import { WebSocketLink } from '@apollo/link-ws';

import { GRAPHQL_SERVER_URL, GRAPHQL_SUBSCRIPTIONS_URL } from './config';

import { LOCAL_APP_STATE } from './store';

import Root from './components/root';

const cache = new InMemoryCache();
const httpLink = new HttpLink({ uri: GRAPHQL_SERVER_URL, fetch });

const wsLink = new WebSocketLink({
  uri: GRAPHQL_SUBSCRIPTIONS_URL,
  options: { reconnect: true },
});

const authLink = setContext((_, { headers }) => {
  const { user } = client.readQuery({ query: LOCAL_APP_STATE });
  return {
    headers: {
      ...headers,
      authorization: user ? `Bearer ${user.authToken}` : '',
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache,
});

const initialLocalAppState = {
  component: { name: 'Home', props: {} },
  user: JSON.parse(window.localStorage.getItem('azdev:user')),
};

client.writeQuery({
  query: LOCAL_APP_STATE,
  data: initialLocalAppState,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Root />
  </ApolloProvider>,
  document.getElementById('root')
);
