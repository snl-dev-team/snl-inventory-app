import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Amplify from 'aws-amplify';
import Dashboard from './containers/dashboard/Dashboard';
import SignUp from './containers/authentication/SignUp';
import SignUpConfirm from './containers/authentication/SignUpConfirm';
import ForgotPasswordSubmit from './containers/authentication/ForgotPasswordSubmit';
import ForgotPassword from './containers/authentication/ForgotPassword';
import SignIn from './containers/authentication/SignIn';

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
  },
});

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/sign-up" component={SignUp} />
      <Route exact path="/sign-up/confirm" component={SignUpConfirm} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/forgot-password/submit" component={ForgotPasswordSubmit} />
      <Route exact path="/sign-in" component={SignIn} />
      <Route path="/" component={Dashboard} />
    </Switch>
  </Router>
);

export default App;
