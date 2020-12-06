import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Analytics from 'react-router-ga';
import Dashboard from './containers/dashboard/Dashboard';
import ForgotPasswordSubmit from './containers/authentication/ForgotPasswordSubmit';
import ForgotPassword from './containers/authentication/ForgotPassword';
import SignIn from './containers/authentication/SignIn';
import { URL } from './constants/url';
import 'graphiql/graphiql.css';

function graphQLFetcher(graphQLParams) {
  return fetch(`${URL}/graphql`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then((response) => response.json());
}
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1c541c',
    },
    secondary: {
      main: '#74b820',
    },
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Analytics id="G-1181DV1D06">
        <Switch>
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/forgot-password/submit" component={ForgotPasswordSubmit} />
          <Route exact path="/sign-in" component={SignIn} />
          <Route exact path="/graphql" component={() => <div style={{ height: '900px' }}><GraphiQL fetcher={graphQLFetcher} /></div>} />
          <Route path="/" component={Dashboard} />
        </Switch>
      </Analytics>
    </Router>
  </ThemeProvider>
);

export default App;
