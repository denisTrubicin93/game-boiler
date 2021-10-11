import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeviceState } from './models';

export const initialState: DeviceState = {
  camera: undefined,
};

export const deviceStateSlice = createSlice({
  name: 'device-state',
  initialState,
  reducers: {
    updateCameraState: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<'occupied' | 'not-occupied' | undefined>
    ) => {
      state.camera = action.payload;
    },
  },
});

export const { updateCameraState } = deviceStateSlice.actions;
export default deviceStateSlice.reducer;
