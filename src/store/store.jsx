import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from "../features/reducers/AuthSlice";
export const store = configureStore({
  reducer: {
    auth:AuthReducer,
  },
});
