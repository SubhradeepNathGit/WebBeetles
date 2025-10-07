import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuth: false
}

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {
        isLoggedInUser: (state) => {
            const token = sessionStorage.getItem('user_token');
            if (token) {
                state.isAuth = true;
            }
        },
        logoutUser: (state) => {
            const token = sessionStorage.getItem('user_token');
            if (token) {
                sessionStorage.removeItem('user_token');
                state.isAuth = false;
            }
        }
    }
})

export default authSlice.reducer;

export const { isLoggedInUser, logoutUser } = authSlice.actions;