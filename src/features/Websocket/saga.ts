import { MiddlewareAPI } from 'redux';

import { TypeSocket } from 'typesocket';
import { Message } from './models';

import {
  connectedAction,
  disconnectedAction,
  messageAction,
  sendMessageAction,
} from './reducer';

export const socketMiddleware = (
  url: string,
  name: string = 'handtracking'
) => {
  return (store: MiddlewareAPI<any, any>) => {
    const socket = new TypeSocket<Message>(url, {
      maxRetries: 0,
      retryOnClose: true,
      retryTime: 2000,
    });
    socket.on('connected', () => store.dispatch(connectedAction()));
    socket.on('disconnected', () => store.dispatch(disconnectedAction()));
    socket.on('message', (message) => {
      store.dispatch(messageAction(message));
      console.log('python >',message);
    });
    socket.connect();

    return (next: (action: any) => void) => (action: any) => {
      if (sendMessageAction.match(action) && socket.readyState === 1) {
        if (action.payload.to === name) {
          socket.send(action.payload.message);
        }
      }

      return next(action);
    };
  };
};
