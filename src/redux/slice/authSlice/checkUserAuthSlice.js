import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../../util/supabase/supabase";
import toastifyAlert from "../../../util/alert/toastify";

// fetch student details
export const fetchStudentDetails = createAsyncThunk("checkUserAuthSlice/fetchStudentDetails",
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await supabase.from("students").select("*").eq("id", studentId).single();
      // console.log('Logged student details response', res);

      if (res?.error) throw new Error(res?.error.message);
      return res?.data;
    }
    catch (err) {
      const message = err?.message ?? "Failed to fetch student details";
      return rejectWithValue(message);
    }
  });

// fetch instructor details
export const fetchInstructorDetails = createAsyncThunk("checkUserAuthSlice/fetchInstructorDetails",
  async (instructorId, { rejectWithValue }) => {
    
    try {
      const res = await supabase.from("instructors").select("*").eq("id", instructorId).single();
      // console.log('Logged instructor details response', res);

      if (res?.error) throw new Error(res?.error.message);
      return res?.data;
    }
    catch (err) {
      const message = err?.message ?? "Failed to fetch instructor details";
      return rejectWithValue(message);
    }
  });

// Check if student session exists
export const checkLoggedInUser = () => async (dispatch) => {
  const { data, error } = await supabase.auth.getSession();

  // console.log('Logged data', data);

  if (error) {
    console.error("Error fetching session:", error.message);
    dispatch(clearUser());
    return;
  }

  if (data.session?.user) {
    dispatch(
      setUser({
        user: data.session.user,
        session: data.session,
      })
    );

    // Fetch user details
    const studentRes = await dispatch(fetchStudentDetails(data?.session?.user?.id));

    if (studentRes.meta.requestStatus === "rejected") {
      await dispatch(fetchInstructorDetails(data?.session?.user?.id));
    }

  } else {
    dispatch(clearUser());
  }
}

// Listen for Supabase Auth login/logout
export const listenAuthChanges = () => (dispatch) => {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      dispatch(
        setUser({
          user: session.user,
          session,
        })
      );

      // Fetch user profile from students
      dispatch(fetchStudentDetails(session.user.id));
    } else {
      dispatch(clearUser());
    }
  })
}

// Logout
export const logoutUser = ({ user_type, status }) => async (dispatch) => {
  try {
    const user_token = user_type == 'student' ? "student_token" : "instructor_token";
    const token = sessionStorage.getItem(user_token);
    if (token) sessionStorage.removeItem(user_token);

    const { error } = await supabase.auth.signOut();

    if (error) throw new Error(error.message);

    dispatch(clearUser());
    if (status) {
      toastifyAlert.success("Logged out successfully");
    }
  }
  catch (err) {
    console.error("Logout error:", err);
    toastifyAlert.error("Logout failed");
  }
}

const initialState = {
  isUserAuth: false,
  userAuthData: undefined,
  session: undefined,
  isUserLoading: false,
  userError: null,
}

export const checkUserAuthSlice = createSlice({
  name: "checkUserAuthSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isUserAuth = true;
      state.userAuthData = action.payload.user;
      state.session = action.payload.session;
      state.userError = null;
    },
    clearUser: (state) => {
      state.isUserAuth = false;
      state.userAuthData = undefined;
      state.session = undefined;
      state.userError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch student
      .addCase(fetchStudentDetails.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userAuthData = action.payload;
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.isUserLoading = false;
        state.userError = action.payload || "Failed to fetch user details";
      })

      // fetch instructor
      .addCase(fetchInstructorDetails.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(fetchInstructorDetails.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userAuthData = action.payload;
      })
      .addCase(fetchInstructorDetails.rejected, (state, action) => {
        state.isUserLoading = false;
        state.userError = action.payload || "Failed to fetch user details";
      });
  },
})

export const { setUser, clearUser } = checkUserAuthSlice.actions;
export default checkUserAuthSlice.reducer;