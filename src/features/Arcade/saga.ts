import { put, takeEvery } from 'redux-saga/effects';
import { messageAction } from '../Websocket/reducer';
import { setCoords } from './reducer';

function* messageHandler(action: ReturnType<typeof messageAction>) {
  try {
    switch (action.payload.cmd) {
      case 'event':
        {
         const result = action.payload.result;
          if (result.event === 'hands_detect') {
            yield put(setCoords(result));
          }
        }

        break;
      default:
        break;
    }
  } catch (error) {
    //
    console.log('error: ', error);
  }
}

export function* watchMessageAction() {
  yield takeEvery(messageAction, messageHandler);
}
