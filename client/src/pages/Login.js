import React, { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {motion} from 'framer-motion'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(
      _,
      {
        data: { login: userData }
      }
    ) {
      context.login(userData);
      props.history.push('/profile');
    },
    onError(err) {
      setErrors(err.graphQLErrors[0]?.extensions?.exception?.errors || {
        general: "An error occurred while trying to login. Please try again."
        
      });
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen justify-center">
      
      <div className="flex items-center justify-center h-screen w-screen md:w-2/4 px-8 md:px-0">
        <div className="w-full top-25">
      <form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <div className = "flex-col">
        <div className="flex justify-center  py-4"><h2 className= "w-96 h-12 px-4 font-poppins font-semibold text-4xl">Login</h2></div>
          <div className="flex justify-center pt-2">
        <input className= "w-96 h-12 bg-white60 px-4 rounded-xl text-xl outline-none focus:bg-white"
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username}
          onChange={onChange}
          />
          </div>
          <div className="flex justify-center py-2">
        <input className= "w-96 h-12 bg-white60 px-4 rounded-xl text-xl outline-none focus:bg-white"
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password}
          onChange={onChange}
          />
          </div>
          <div className="flex justify-center items-center pt-8 pb-4 focus:outline-none">
        <button type="submit" className="w-96 h-12 bg-night px-4 rounded-xl focus:outline-none" primary>
          <motion.p className="font-mulish font-bold text-white text-xl focus:outline-none" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Login</motion.p>
        </button>
        </div>
        <h3 className="text-center py-4 md:py-8 font-poppins font-normal text-xl">Or <Link to="/register" className="text-coral">Sign Up</Link> instead.</h3>
        </div>
      </form>
      {Object.keys(errors).length > 0 && (
        <div className="flex justify-center text-coral">
          <ul className="w-96 text-center">
            {Object.values(errors).map((value) => (
              <span key={value} className="flex justify-center py-1 font-poppins font-semibold text-base">{value}</span>
              ))}
          </ul>

        </div>
      )}
      </div>
      </div>
      <div className= 'hidden md:flex h-2/4 sm:h-screen w-screen md:w-2/4 items-center bg-pink'>
        <div>
        <h2 className="px-16 font-poppins font-black text-4xl">Welcome Back. <br />Sign  in to your Account.<br /></h2>
        </div>
      </div>
    </div>
  );
}

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
