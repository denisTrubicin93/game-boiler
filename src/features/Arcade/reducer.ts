import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coords, initialState } from './models';

const arcadeSlice = createSlice({
  name: 'arcade',
  initialState,
  reducers: {
    setCoords: (state, action: PayloadAction<Coords>) => {
      // if (state.coords) {
      //   state.coords = JSON.parse(JSON.stringify(action.payload));
      // }
      state.coords = action.payload;
    },
    setPoints: (state, action: PayloadAction<number>) => {
      // if (state.coords) {
      //   state.coords = JSON.parse(JSON.stringify(action.payload));
      // }
      state.points = action.payload;
      console.log('setPoints', state.points)
    },
  },
});

export default arcadeSlice.reducer;
export const { setCoords, setPoints } = arcadeSlice.actions;
