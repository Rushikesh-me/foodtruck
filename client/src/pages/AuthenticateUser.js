import React, {useState} from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

import { Link } from 'react-router-dom';


const AUTHENTICATE_USER = gql `
mutation($token: String!){
authenticateUser(token: $token)}
`;

function AuthenticateUser(props) {
const [errors, setErrors] = useState({});
const [authenticateUser, { loading, error, data}] = useMutation(AUTHENTICATE_USER, {
  onError(err) {
    setErrors(err.graphQLErrors[0]);
  } }
)

const authToken = props.match.params.token;
authenticateUser({variables: {token: authToken}});
const authStatus = data ? (
    <div className="absolute flex h-screen w-screen justify-center items-center">
    <h1 className="font-poppins font-bold mb-16 text-center text-lg md:text-4xl">Your account is authenticated. <br /> Click <Link to="/login" className="text-coral">here</Link> to login. </h1></div>
) : error ? (
    <div className="absolute flex h-screen w-screen justify-center items-center">
    <h1 className="font-poppins font-normal text-center mb-16 text-md md:text-2xl">Authentication Error.<br /> Please reply 'authentication error' to the authentication email and please wait for us to get back.<span className="text-coral"> {errors.message}</span></h1>
    </div>
): (
  <div className="absolute flex h-screen w-screen justify-center items-center">
  <h1 className="font-poppins font-bold text-center mb-16 text-lg md:text-4xl">Authenticating. Please wait.<br /><span className="text-coral"> {errors.message}</span></h1>
  </div>
)
return authStatus;
}


export default AuthenticateUser;
