import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    categorymodal: false,
    locationmodal: false,
    addFromMap: false,
    itemFromMap: null,
  },
  reducers: {
    openCategoryModal: (state) => {
      state.categorymodal = true;
    },
    closeCategoryModal: (state) => {
      state.categorymodal = false;
    },
    openLocationModal: (state) => {
      state.locationmodal = true;
    },
    closeLocationModal: (state) => {
      state.locationmodal = false;
    },
    addInfoFromMap: (state) => {
      state.addFromMap = true;
    },
    resetAddInfoFromMap: (state) => {
      state.addFromMap = false;
    },
    addItemFromMap: (state, action) => {
      state.itemFromMap = action.payload;
    },
    removeItemFromMap: (state, action) => {
      state.itemFromMap = null;
    },
  },
});

export const {
  openCategoryModal,
  closeCategoryModal,
  openLocationModal,
  closeLocationModal,
  addInfoFromMap,
  resetAddInfoFromMap,
  addItemFromMap,
  removeItemFromMap,
} = modalSlice.actions;

export const selectCategoryModalIsOpen = (state) => state.modal.categorymodal;
export const selectLocationModalIsOpen = (state) => state.modal.locationmodal;
export const selectAddInfoFromMap = (state) => state.modal.addFromMap;
export const selectItemFromMap = (state) => state.modal.itemFromMap;

export default modalSlice.reducer;
