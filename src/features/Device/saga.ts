import { takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import axios from 'axios';

import moment from 'moment';

import { DeviceService } from '../../service/DeviceService';

// const eventLogUrl = `https://st-aflac.platformerfuji.com/mirror/analytics/eventlogs`;
const eventLogUrl = 'http://localhost:8001/mirror/analytics/eventlogs';

function* handleRouterActions(action: LocationChangeAction) {
  const device = DeviceService.default().deviceId() || '99999999';
  const skeltonId = DeviceService.default().skeletonId() || '0';
  const timestamp = moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSSSSSZZ');
  // console.log('eventLogUrl: ', eventLogUrl);
  // console.log('device: ', device);
  // console.log('location: ', action.payload.location.pathname);
  // console.log('timestamp: ', timestamp);
  try {
    axios.post(`${eventLogUrl}/${device}`, { datas: [{
      timestamp: timestamp,
      device: device,
      id: skeltonId,
      eventtype: "ROUTE",
      eventlog: action.payload.location.pathname,
      cpu: "",
      memory: "",
    }]},
    {
      timeout: 8000,
      headers: {
        'Content-Type': 'application/json',
        // apiKey: 'dgVbeYHLlJZIhq4RsX0nEpg0w4twvTmf',
      },
    }).then(response => {
      console.log('response: ', response);
    }).catch(error => {
      console.log('error: ', error);
    })
  } catch (error) {
    console.log('error: ', error);
  }
}

export function* eventLogPostTask() {
  yield takeEvery(LOCATION_CHANGE, handleRouterActions);
}
