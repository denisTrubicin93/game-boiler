import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coords, initialState } from './models';

const arcadeSlice = createSlice({
  name: 'arcade',
  initialState,
  reducers: {
    setCoords: (state, action: PayloadAction<Coords>) => {
      console.log('setCoords', action.payload);
      // if (state.coords) {
      //   state.coords = JSON.parse(JSON.stringify(action.payload));
      // }
      state.coords = action.payload;
    },
  },
});

export default arcadeSlice.reducer;
export const { setCoords } = arcadeSlice.actions;
