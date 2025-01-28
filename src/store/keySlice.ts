import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface KeyState {
  key: string | null;
}

const initialState: KeyState = {
  key: null,
};

const keySlice = createSlice({
  name: 'key',
  initialState,
  reducers: {
    setKey(state, action: PayloadAction<string>) {
      state.key = action.payload;
    },
    clearKey(state) {
      state.key = null;
    },
  },
});

export const { setKey, clearKey } = keySlice.actions;
export default keySlice.reducer;