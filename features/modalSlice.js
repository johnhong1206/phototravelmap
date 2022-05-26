import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    categorymodal: false,
    locationmodal: false,
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
  },
});

export const {
  openCategoryModal,
  closeCategoryModal,
  openLocationModal,
  closeLocationModal,
} = modalSlice.actions;

export const selectCategoryModalIsOpen = (state) => state.modal.categorymodal;
export const selectLocationModalIsOpen = (state) => state.modal.locationmodal;

export default modalSlice.reducer;
