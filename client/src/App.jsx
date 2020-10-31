import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dashboard from './containers/dashboard/Dashboard';
import SignUp from './containers/SignUp';
import store from './store';

const App = () => (
  <Provider store={store}>
    <Router>
      <Route exact path="/signup" component={SignUp} />
      <Route path="/" component={Dashboard} />
    </Router>
  </Provider>
);

export default App;
