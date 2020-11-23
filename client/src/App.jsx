import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Amplify from 'aws-amplify';
import GraphiQL from 'graphiql';
import axios from 'axios';
import Dashboard from './containers/dashboard/Dashboard';
import SignUp from './containers/authentication/SignUp';
import SignUpConfirm from './containers/authentication/SignUpConfirm';
import ForgotPasswordSubmit from './containers/authentication/ForgotPasswordSubmit';
import ForgotPassword from './containers/authentication/ForgotPassword';
import SignIn from './containers/authentication/SignIn';
import { URL } from './constants/url';
import 'graphiql/graphiql.css';

function graphQLFetcher(graphQLParams) {
  return axios.post(
    `${URL}/graphql`,
    graphQLParams,
    {
      headers: { 'Content-Type': 'application/json' },
    },
  ).then((res) => res.data);
}

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
      <Route exact path="/graphql" component={() => <div style={{ height: '900px' }}><GraphiQL fetcher={graphQLFetcher} /></div>} />
      <Route path="/" component={Dashboard} />
    </Switch>
  </Router>
);

export default App;
