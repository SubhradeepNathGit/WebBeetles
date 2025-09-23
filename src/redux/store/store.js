import { configureStore } from "@reduxjs/toolkit";
import userAuthSliceReducer from "../slice/authSlice/authSlice";

const store = configureStore({
    reducer: {
        userAuth: userAuthSliceReducer
    }
});

export default store;