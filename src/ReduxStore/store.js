import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./UserSlice.jsx";

const store = configureStore({
  reducer: {
    post: UserSlice,
  },
});
export default store;
