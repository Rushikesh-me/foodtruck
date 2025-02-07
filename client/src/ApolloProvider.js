import React from 'react';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';


import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { setContext } from 'apollo-link-context';

const httpLink = createUploadLink({
  uri: `http://localhost:3000/graphql`
});

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
