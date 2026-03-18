import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../slice/authSlice/authSlice";
import categorySliceReducer from "../slice/categorySlice";
import checkUserAuthSliceReducer from "../slice/authSlice/checkUserAuthSlice";
import courseSliceReducer from "../slice/couseSlice";
import studentProfileSliceReducer from "../slice/studentSlice";
import contactAuthSliceReducer from "../slice/contactSlice";
import instructorSliceReducer from "../slice/instructorSlice";
import reviewSliceReducer from "../slice/reviewSlice";
import videoSliceReducer from "../slice/videoSlice";
import chargesSliceReducer from "../slice/chargesSlice";
import promocodeSliceReducer from "../slice/promocodeSlice";
import cartSliceReducer from "../slice/cartSlice";
import purchaseSliceReducer from "../slice/purchaseSlice";
import paymentSliceReducer from "../slice/paymentSlice";
import activitySliceReducer from "../slice/activitySlice";
import videoProgressSliceReducer from "../slice/videoProgressSlice";
import studentSliceReducer from "../slice/allStudentSlice";
import platformSliceReducer from "../slice/platformSlice";

const store = configureStore({
    reducer: {
        checkAuth: checkUserAuthSliceReducer,
        auth: authSliceReducer,
        student: studentProfileSliceReducer,
        allStudent: studentSliceReducer,
        instructor: instructorSliceReducer,
        category: categorySliceReducer,
        course: courseSliceReducer,
        lecture: videoSliceReducer,
        review: reviewSliceReducer,
        charge: chargesSliceReducer,
        cart: cartSliceReducer,
        promocode: promocodeSliceReducer,
        purchase: purchaseSliceReducer,
        query: contactAuthSliceReducer,
        payment: paymentSliceReducer,
        activity: activitySliceReducer,
        lectureProgress: videoProgressSliceReducer,
        platform: platformSliceReducer
    }
});

export default store;