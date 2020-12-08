import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Route, Switch, useHistory,
} from 'react-router-dom';
import GraphiQL from 'graphiql';
import fetch from 'isomorphic-fetch';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Analytics from 'react-router-ga';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
import { isNil } from 'lodash';
import Dashboard from './containers/dashboard/Dashboard';
import ForgotPasswordSubmit from './containers/authentication/ForgotPasswordSubmit';
import ForgotPassword from './containers/authentication/ForgotPassword';
import SignIn from './containers/authentication/SignIn';
import { URL } from './constants/url';
import 'graphiql/graphiql.css';
import Spinner from './components/Spinner';

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

const ProtectedRoute = ({ exact, path, component }) => {
  const { push } = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    (async () => {
      const userInfo = await Auth.currentUserInfo();
      setIsAuthenticated(!isNil(userInfo));
    })();
  });

  if (isAuthenticated === false) {
    push('/sign-in');
  }
  return <Route exact={exact} path={path} component={isAuthenticated ? component : Spinner} />;
};

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Analytics id="G-1181DV1D06">
        <Switch>
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/forgot-password/:email" component={ForgotPasswordSubmit} />
          <Route exact path="/sign-in" component={SignIn} />
          <Route exact path="/graphql" component={() => <div style={{ height: '900px' }}><GraphiQL fetcher={graphQLFetcher} /></div>} />
          <ProtectedRoute path="/" component={Dashboard} />
        </Switch>
      </Analytics>
    </Router>
  </ThemeProvider>
);

ProtectedRoute.propTypes = {
  exact: PropTypes.bool,
  path: PropTypes.string.isRequired,
  component: PropTypes.func.isRequired,

};

ProtectedRoute.defaultProps = {
  exact: false,
};

export default App;
