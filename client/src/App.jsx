import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Amplify from 'aws-amplify';
import Dashboard from './containers/dashboard/Dashboard';
import SignUp from './containers/SignUp';
import ConfirmSignUp from './containers/ConfirmSignUp';
import SignIn from './containers/SignIn';

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
      <Route exact path="/sign-up/confirm" component={ConfirmSignUp} />
      <Route exact path="/sign-in" component={SignIn} />
      <Route path="/" component={Dashboard} />
    </Switch>
  </Router>
);

export default App;
