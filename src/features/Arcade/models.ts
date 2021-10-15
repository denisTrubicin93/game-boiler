export const initialState = {
  points: 0,
  coords: {
    event: 'arcade',
    result: [
      [
        [0, 0],
        [0, 0],
      ],
      [
        [0, 0],
        [0, 0],
      ],
    ],
    image: '',
  },
};
type HandCoords = number[];

type Hand = HandCoords[];

export interface Coords {
  event: string;
  result: Hand[];
  image: string;
}

// export const initialState = {
//   points: 0,
//   coords: {
//     event: 'arcade',
//     x: 0,
//     y: 0,
//     w: 200,
//     h: 200,
//   },
// };

// export interface Coords {
//   event: string;
//   result:
//   x: number;
//   y: number;
//   w: number;
//   h: number;
// }
