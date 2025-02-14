import React from 'react';
import App from './App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';


import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { setContext } from 'apollo-link-context';

const httpLink = createUploadLink({
	uri: `https://3vs1qyruvc.execute-api.eu-west-1.amazonaws.com/dev/graphql`,
	credentials: "include",
	headers: {
    "Content-Type": "application/json",
    // @ts-ignore
    "Access-Control-Allow-Origin": "*",
		// @ts-ignore
		"Access-Control-Allow-Credentials": false,
	},
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
  // @ts-ignore
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
