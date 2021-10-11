import { Coords } from "features/Arcade/models";

export interface MessageModel {
  message: Message;
}

export const initialState: MessageModel = {
  message: {
    cmd: 'set_coord_trans',
    result: 'NG',
  },
};

export interface ActionModel {
  value: any;
}

export interface HandPoint {
  point: string;
}

export interface EventMessage {
  cmd: 'event';
  result: Coords;
}
export interface SetCoordTransResponse {
  cmd: 'set_coord_trans';
  result: 'OK' | 'NG';
}

export type Message = EventMessage | SetCoordTransResponse;
