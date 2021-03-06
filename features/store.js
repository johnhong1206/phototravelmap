import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import modalReducer from "./modalSlice";
import userReducer from "./userSlice";
import darkModeReducer from "./darkmodeSlice";
import placeInfoReducer from "./placeinfoSlice";

const reducers = combineReducers({
  modal: modalReducer,
  user: userReducer,
  darkMode: darkModeReducer,
  placeInfo: placeInfoReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
});
