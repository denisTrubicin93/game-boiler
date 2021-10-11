import { Subject } from 'rxjs';
import Websocket from '../components/network/Websocket';

export interface ActionHistory {
  userId: number;
  action: 'sayHello';
}

export interface ServerResult {
  cmd:
    | 'skeleton'
    | 'hand'
    | 'face'
    | 'fall'
    | 'skeleton_enable'
    | 'skeleton_disable'
    | 'call_staff'
    | 'qr_print'
    | 'color'
    | 'config';
  result: any;
}

export interface Greeting {
  message: string;
}

export interface Person {
  id: number;
  state: 'detect' | 'gone' | 'fall' | 'away' | 'unknown';
}

export interface Face {
  gender: 'male' | 'female' | 'unknown';
  age: number;
}

export interface Config {
  deviceId: string;
  deviceType: string;
  deviceName: string;
  description: string;
  token: string;
  settings: Setting[];
}

export interface Setting {
  name: string;
  type: string;
  code: string;
  icon: string;
  value: string;
  enable: boolean;
}

export class DeviceService {
  private static instance: DeviceService;

  readonly onPersonDetectSubject = new Subject<Person>();

  readonly onFaceSubject = new Subject<Face>();

  readonly onGreetingSubject = new Subject<Greeting>();

  ws = new Websocket('ws://localhost:8765');

  faceCmd = '{"cmd":"face"}';

  enableSkeletonCmd = '{"cmd":"skeleton_enable"}';

  disableSkeletonCmd = '{"cmd":"skeleton_disable"}';

  detectColorsCmd = '{"cmd":"color"}';

  configCmd = '{"cmd":"config"}';

  skeledtonData: any;

  targetSkeletonId = -1;

  awaySkeltonId = -1;

  distance = -1;

  actionHistories: ActionHistory[];

  targetActionHistories: ActionHistory[];

  position: 'left' | 'center' | 'rigth' | 'none' = 'none';

  ignoreCount = 0;

  ignoreMax = 20;

  detect = false;

  goneTimerId: any;

  goneTimerSet = false;

  handHistory: any[] = [[0, 0]];

  lastHandPoint = ' ';

  handWait = false;

  config: any;

  public static default(): DeviceService {
    if (!DeviceService.instance) {
      DeviceService.instance = new DeviceService();
    }
    return DeviceService.instance;
  }

  constructor() {
    this.skeledtonData = {};
    this.actionHistories = [];
    this.targetActionHistories = [];

    this.ws?.onOpenSubject.subscribe(() => {
      this.loadConfig();
    });
    this.ws?.onMessageSubject.subscribe((message: string) => {
      try {
        const result = JSON.parse(message) as ServerResult;
        switch (result.cmd) {
          case 'skeleton':
            this.updateSkeleton(result.result);

            break;
          case 'fall':
            console.log(`detect fall: ${result.result}`);
            // this.onFall();
            break;
          case 'skeleton_enable':
            // console.log(`skeleton_enable: ${result.result}`);
            break;
          case 'skeleton_disable':
            // console.log(`skeleton_disable: ${result.result}`);
            break;
          case 'call_staff':
            break;
          case 'qr_print':
            break;
          case 'color':
            console.log(`detect colors: ${result.result}`);
            break;
          case 'config':
            this.config = result.result;
            break;
          default:
            console.log('unknown command.');
            break;
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  start() {
    this.ws?.setupWebsocket();
  }

  updateSkeleton(data: any) {
    this.skeledtonData = data;

    // if (this.skeledtonData.numSkeletons === 0) {
    //   this.goneCountUp();
    //   return;
    // }

    if (!this.isDelectSkeleton() && this.skeledtonData.numSkeletons > 0) {
      this.getMainSkeletonInfo();
    } else if (this.isDelectSkeleton()) {
      this.updateMainSkeletonInfo();
    }
  }

  isDelectSkeleton(): boolean {
    return this.targetSkeletonId !== -1;
  }

  // eslint-disable-next-line class-methods-use-this
  isTargetZone(xaxis: number, distance: number): boolean {
    // console.log(`xaxis: ${xaxis} distance: ${distance}`);
    let position;
    console.log(position);
    if (xaxis > 900) {
      position = 'left';
    } else if (xaxis <= 500 && xaxis >= 200) {
      position = 'center';
    } else {
      position = 'rigth';
    }

    // return distance < 1.5 && position === 'center';
    return distance < 3.5;
  }

  // eslint-disable-next-line class-methods-use-this
  isAwayZone(xaxis: number, distance: number): boolean {
    // console.log(`xaxis: ${xaxis} distance: ${distance}`);
    let position = '';
    if (xaxis <= 1000 && xaxis >= 200) {
      position = 'center';
      console.log(position);
    }

    // return distance > 1.5 && position === 'center';
    return distance > 2.5 && distance < 4.5;
  }

  // eslint-disable-next-line class-methods-use-this
  getMainSkeletonInfo() {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.skeledtonData.skeletons) {
      const { distance } = item;
      const { xaxis } = item;

      if (distance === 0 || !xaxis) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // console.log('Main Skelton');
      // console.log( item.id + ':' + distance);
      if (this.isTargetZone(xaxis, distance)) {
        // SkeltonIdをセット
        this.targetSkeletonId = item.id;
        this.distance = distance;
        // console.log(
        //   `detect person. id: ${this.targetSkeletonId} effectiveSize: ${this.skeledtonData.skeletons[0].effectiveSize}`
        // );
        break;
      } else if (this.isAwayZone(xaxis, distance)) {
        if (this.awaySkeltonId != item.id) {
          this.onAway();
          this.awaySkeltonId = item.id;
        }
        break;
      } else {
        // eslint-disable-next-line no-continue
        continue;
      }
    }
  }

  updateMainSkeletonInfo() {
    if (!this.skeledtonData.skeletons) {
      // console.debug('no skeleton');
      return;
    }
    // console.log(this.skeledtonData.skeletons);
    // Get a target skeleton ID.
    const trackingSkeleton = this.skeledtonData.skeletons;

    if (trackingSkeleton.length > 0) {
      const { xaxis } = trackingSkeleton[0];
      const { distance } = trackingSkeleton[0];

      if (distance === 0 || !distance || !xaxis) {
        // console.debug('ignore values');
        return;
      }

      // console.log(distance)
      if (this.isTargetZone(xaxis, distance)) {
        // console.log('in zone');
        this.distance = distance;
        clearTimeout(this.goneTimerId);
        this.goneTimer();
        this.doAction();
      } else {
        if (!this.goneTimerSet) {
          this.goneTimer();
        }
        // console.debug('out of zone');
      }
    } else {
      if (!this.goneTimerSet) {
        this.goneTimer();
      }
      // console.debug('no skeleton for id');
    }
  }

  isHnadSkeleton(data: any) {
    if (!data.hands) {
      return false;
    }
    if (this.handWait && this.lastHandPoint === data.hands.point) {
      console.log('wait!!! ' + this.lastHandPoint + '::' + data.hands.point);
      return false;
    } else {
      this.handWait = false;
    }

    if (!data.skeletons) {
      // console.debug('no skeleton');
      return false;
    }
    // Get a target skeleton ID.
    const trackingSkeleton = data.skeletons;

    if (trackingSkeleton.length > 0) {
      const { xaxis } = trackingSkeleton[0];
      const { distance } = trackingSkeleton[0];

      if (distance === 0 || !distance || !xaxis) {
        // console.debug('ignore values');
        return;
      }

      // console.log(distance)
      if (this.isTargetZone(xaxis, distance)) {
        return true;
      }
    }
    return false;
  }

  goneTimer() {
    // console.log('Set goneTimer!!');
    this.goneTimerId = setTimeout(() => {
      this.gone();
    }, 60000);
    this.goneTimerSet = true;
    // console.log('Set timeout timer:' + this.goneTimerId);
  }

  goneCountUp() {
    if (this.targetSkeletonId === -1) {
      return;
    }

    if (this.ignoreCount > this.ignoreMax) {
      this.gone();
    } else {
      // eslint-disable-next-line no-plusplus
      ++this.ignoreCount;
      // console.log(`goneCountUp: ${this.ignoreCount}`);
    }
  }

  gone() {
    console.log('gone');
    this.targetSkeletonId = -1;
    this.distance = -1;
    if (this.targetActionHistories.length > 0) {
      this.actionHistories = this.actionHistories.concat(
        this.targetActionHistories
      );
      this.targetActionHistories = [];
    }
    this.ignoreCount = 0;
    this.onGone();
    this.goneTimerSet = false;
  }

  doAction() {
    console.log('doAction');
    this.ignoreCount = 0;
    this.doSayHello();
  }

  doSayHello() {
    const addHistory = () => {
      this.targetActionHistories.push({
        userId: this.targetSkeletonId,
        action: 'sayHello',
      });
    };

    // if (this.distance > 1.0) {
    //   return;
    // }

    const pCompleted = this.actionHistories.filter((history) => {
      return (
        history.userId === this.targetSkeletonId &&
        history.action === 'sayHello'
      );
    });
    const cCompleted = this.targetActionHistories.filter((history) => {
      return (
        history.userId === this.targetSkeletonId &&
        history.action === 'sayHello'
      );
    });
    if (pCompleted.length === 1 && cCompleted.length === 0) {
      console.log('doSayHello again');
      const message = 'またお会いしましたね';
      this.onGreetingSubject.next({ message });
      addHistory();
      this.onDetect();
      return;
    }

    if (pCompleted.length === 0 && cCompleted.length === 0) {
      console.log('doSayHello');
      const message = 'こんにちは';
      this.onGreetingSubject.next({ message });
      addHistory();
      this.onDetect();
      return;
    }
    if (cCompleted.length === 0) {
      addHistory();
      this.onDetect();
    }
  }

  onDetect() {
    console.log('onDetect');
    this.onPersonDetectSubject.next({
      id: this.targetSkeletonId,
      state: 'detect',
    });
    this.detect = true;
  }

  onAway() {
    this.onPersonDetectSubject.next({
      id: this.targetSkeletonId,
      state: 'away',
    });
  }

  onGone() {
    console.log('onGone !!!');
    this.onPersonDetectSubject.next({
      id: this.targetSkeletonId,
      state: 'gone',
    });
    this.detect = false;
  }

  onFall() {
    if (this.detect) {
      console.log(this.onPersonDetectSubject);
      this.onPersonDetectSubject.next({
        id: this.targetSkeletonId,
        state: 'fall',
      });
    }
  }

  faceRecognition() {
    this.ws?.sendMessage(this.faceCmd);
  }

  enableSkeleton() {
    this.ws?.sendMessage(this.enableSkeletonCmd);
  }

  disableSkeleton() {
    this.ws?.sendMessage(this.disableSkeletonCmd);
  }

  detectColors() {
    this.ws?.sendMessage(this.detectColorsCmd);
  }

  loadConfig() {
    this.ws?.sendMessage(this.configCmd);
  }

  deviceId() {
    if (this.config) {
      return this.config.deviceId;
    } else {
      return '99999999';
    }
  }

  skeletonId() {
    return this.targetSkeletonId;
  }

  token() {
    if (this.config) {
      return this.config.token;
    }
    return '';
  }

  settings() {
    if (this.config) {
      return this.config.settings;
    }
    return null;
  }

  callStaff() {
    const cmd = {
      cmd: 'call_staff',
    };
    this.ws?.sendMessage(JSON.stringify(cmd));
  }

  qrPrint(code: String) {
    const cmd = {
      cmd: 'qr_print',
      code: code,
    };
    this.ws?.sendMessage(JSON.stringify(cmd));
  }

  setHandWait() {
    this.handWait = true;
  }

  clearWait() {
    this.handWait = false;
  }
}
