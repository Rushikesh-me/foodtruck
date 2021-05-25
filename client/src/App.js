import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import AuthenticateUser from './pages/AuthenticateUser';
import Redirect from './pages/RegRedirect';


function App() {
  return (
    <AuthProvider>
      <Router>
          <MenuBar/>
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path={`/profile/:username`} component={UserProfile} />
          <Route path={`/authenticate/:token`} component={AuthenticateUser} />
          <Route exact path={`/redirect/register`} component={Redirect} />
      </Router>
    </AuthProvider>
  );
}

export default App;
