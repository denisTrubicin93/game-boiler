import { Subject } from 'rxjs';

export default class Websocket {
  readonly onMessageSubject = new Subject<any>();

  readonly onOpenSubject = new Subject();

  readonly onCloseSubject = new Subject();

  readonly onErrorSubject = new Subject();

  shouldReconnect = true;

  timeoutID!: NodeJS.Timeout;

  debug = true;

  reconnectIntervalInMilliSeconds = 0;

  attempts = 1;

  url: string;

  ws: WebSocket | null = null;

  constructor(url: string) {
    this.url = url;
    this.initWS();
  }

  initWS() {
    const Socket = window.WebSocket;
    this.ws = new Socket(this.url);
  }

  close() {
    this.shouldReconnect = false;
    clearTimeout(this.timeoutID);
    this.ws?.close();
  }

  sendMessage(message: string) {
    this.ws?.send(message);
    console.log(message)
  }

  logging(logline: string) {
    if (this.debug === true) {
      console.log(logline);
    }
  }

  generateInterval(k: number) {
    if (this.reconnectIntervalInMilliSeconds > 0) {
      return this.reconnectIntervalInMilliSeconds;
    }
    // eslint-disable-next-line no-restricted-properties
    return Math.min(30, Math.pow(2, k) - 1) * 1000;
  }

  setupWebsocket() {
    const websocket = this.ws;

    if (!websocket) {
      return;
    }

    websocket.onopen = () => {
      this.logging('Websocket connected');
      this.onOpenSubject.next();
    };

    websocket.onerror = () => {
      this.onErrorSubject.next();
    };

    websocket.onmessage = (evt) => {
      this.onMessageSubject.next(evt.data);
    };

    websocket.onclose = (evt) => {
      this.logging(
        `Websocket disconnected,the reason: ${evt.reason},the code: ${evt.code}`
      );
      this.onCloseSubject.next();
      if (this.shouldReconnect) {
        const time = this.generateInterval(this.attempts);
        this.timeoutID = setTimeout(() => {
          this.attempts += 1;
          this.initWS();
          this.setupWebsocket();
        }, time);
      }
    };
  }
}
