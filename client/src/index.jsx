import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import App from './App';
import { store, persistor } from './store';
import { URL } from './constants/url';

const client = new ApolloClient({
  uri: `${URL}/graphql`,
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
