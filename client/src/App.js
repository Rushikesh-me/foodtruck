import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

const MenuBar = lazy(() => import ('./components/MenuBar'))
const Home = lazy(() => import ('./pages/Home'))
const Login = lazy(() => import ('./pages/Login'))
const Register = lazy(() => import ('./pages/Register'))
const Profile = lazy(() => import ('./pages/Profile'))
const UserProfile = lazy(() => import ('./pages/UserProfile'))
const AuthenticateUser = lazy(() => import ('./pages/AuthenticateUser'))
const Redirect = lazy(() => import ('./pages/RegRedirect'))


function App() {
  return (
    <AuthProvider>
      <Router>
          <MenuBar/>
          <Suspense fallback={
          <div className="absolute flex h-screen w-screen justify-center items-center">
          <h1 className="font-poppins font-bold mb-16 text-lg md:text-4xl">Loading...</h1>
          </div>}>
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path={`/profile/:username`} component={UserProfile} />
          <Route path={`/authenticate/:token`} component={AuthenticateUser} />
          <Route exact path={`/redirect/register`} component={Redirect} />
          </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
