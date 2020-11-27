import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  ApolloClient, InMemoryCache, ApolloProvider, HttpLink,
} from '@apollo/client';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Amplify from 'aws-amplify';
import fetch from 'isomorphic-fetch';
import produce from 'immer';
import App from './App';
import { store, persistor } from './store';
import { URL } from './constants/url';

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
  },
});

const authFetch = (uri, options) => {
  const state = store.getState();
  const newOptions = produce(options, (draft) => {
    // eslint-disable-next-line no-param-reassign
    draft.headers.Authorization = state.user.token;
  });
  return fetch(uri, newOptions);
};

const client = new ApolloClient({
  link: new HttpLink({ uri: `${URL}/graphql`, fetch: authFetch }),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <App />
        </MuiPickersUtilsProvider>
      </PersistGate>
    </Provider>
  </ApolloProvider>,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
);
