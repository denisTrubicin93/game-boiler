export const initialState = {
  coords: {
    event: 'arcade',
    x: 0,
    y: 0,
    w: 200,
    h: 200,
  }
}

export interface Coords {
  event: string;
  x: number;
  y: number;
  w: number;
  h: number;
}
