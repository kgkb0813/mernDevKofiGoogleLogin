import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clientBookingMode: false,
  numGuest: 0,
  numAdmin: 0,
  mainCost: 0,
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setClientBookingMode(state, action) {
      state.clientBookingMode = action.payload;
    },
    setNumGuest(state, action) {
      state.numGuest = action.payload;
    },
    setNumAdmin(state, action) {
      state.numAdmin = action.payload;
    },
    setMainCost(state, action) {
      state.mainCost = action.payload;
    },
  },
});

export const { setClientBookingMode, setNumGuest, setNumAdmin, setMainCost } = appStateSlice.actions;
export default appStateSlice.reducer;
