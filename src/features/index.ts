import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import { connectRouter, routerMiddleware } from 'connected-react-router';
import { history } from './history';

import deviceStateReducer from './Device/reducer';

import websocketReducer from './Websocket/reducer';
import { socketMiddleware } from './Websocket/saga';

import { eventLogPostTask } from './Device/saga';

import arcadeReducer from './Arcade/reducer';
import { watchMessageAction } from './Arcade/saga';

const rootReducer = combineReducers({
  ws: websocketReducer,
  device: deviceStateReducer,
  arcade: arcadeReducer,
  router: connectRouter(history),
});

const rootSaga = function* rootSaga() {
  yield all([fork(eventLogPostTask), fork(watchMessageAction)]);
};

const sagaMiddleware = createSagaMiddleware();
const rootMiddleware = [
  socketMiddleware('ws://localhost:1234/', 'pose'), // for pose estimation API
  routerMiddleware(history),
  sagaMiddleware,
];
type RootState = ReturnType<typeof rootReducer>;

export {
  history,
  RootState,
  rootReducer,
  rootSaga,
  rootMiddleware,
  sagaMiddleware,
};
