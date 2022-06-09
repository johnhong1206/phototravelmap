import { createSlice } from "@reduxjs/toolkit";

export const placeInfoSlice = createSlice({
  name: "placeInfo",
  initialState: {
    placeInfo: [],
  },
  reducers: {
    getAreaInfo: (state, action) => {
      state.placeInfo = action.payload;
    },

    removeInfo: (state) => {
      state.placeInfo = null;
    },
  },
});

export const { getAreaInfo, removeInfo } = placeInfoSlice.actions;

export const selectPlaceInfo = (state) => state.placeInfo.placeInfo;

export default placeInfoSlice.reducer;
