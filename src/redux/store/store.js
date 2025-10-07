import { configureStore } from "@reduxjs/toolkit";
import userAuthSliceReducer from "../slice/authSlice/authSlice";
import categorySliceReducer from "../slice/categorySlice";
import authSliceReducer from "../slice/authSlice/checkAuth";
import courseSliceReducer from "../slice/couseSlice";
import userProfileSliceReducer from "../slice/userSlice";
import specificCourseSliceReducer from "../slice/specificCourseSlice";
import specificCategorySliceReducer from "../slice/specificCategorySlice";
import contactAuthSliceReducer from "../slice/contactSlice";

const store = configureStore({
    reducer: {
        checkAuth: authSliceReducer,
        userAuth: userAuthSliceReducer,
        user: userProfileSliceReducer,
        category: categorySliceReducer,
        course: courseSliceReducer,
        specificCourse: specificCourseSliceReducer,
        specificCategory: specificCategorySliceReducer,
        query: contactAuthSliceReducer
    }
});

export default store;