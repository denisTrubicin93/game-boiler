import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from '../store';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { history } from 'features';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root') as HTMLElement
);
