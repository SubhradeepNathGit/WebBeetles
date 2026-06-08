import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../../util/supabase/supabase";
import toastifyAlert from "../../../util/alert/toastify";

// fetch student details
export const fetchStudentDetails = createAsyncThunk("checkUserAuthSlice/fetchStudentDetails",
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await supabase.from("students").select("*").eq("id", studentId).maybeSingle();
      // console.log('Logged student details response', res);

      if (res?.error) throw new Error(res?.error.message);
      if (!res?.data) throw new Error("Student not found");
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
      const res = await supabase.from("instructors").select("*").eq("id", instructorId).maybeSingle();
      // console.log('Logged instructor details response', res);

      if (res?.error) throw new Error(res?.error.message);
      if (!res?.data) throw new Error("Instructor not found");
      return res?.data;
    }
    catch (err) {
      const message = err?.message ?? "Failed to fetch instructor details";
      return rejectWithValue(message);
    }
  });

// fetch admin details
export const fetchAdminDetails = createAsyncThunk("checkUserAuthSlice/fetchAdminDetails",
  async (adminId, { rejectWithValue }) => {
    try {
      const res = await supabase.from("admins").select("*").eq("id", adminId).maybeSingle();
      if (res?.error) throw new Error(res?.error.message);
      if (!res?.data) throw new Error("Admin not found");
      return res?.data;
    }
    catch (err) {
      const message = err?.message ?? "Failed to fetch admin details";
      return rejectWithValue(message);
    }
  });

// Determine fetch order based on sessionStorage tokens.
// This ensures we try the correct role's table FIRST, preventing
// wrong-role resolution when the same user ID exists in multiple tables.
const getFetchOrder = () => {
  const order = [];
  if (sessionStorage.getItem('admin_token')) order.push(fetchAdminDetails);
  if (sessionStorage.getItem('instructor_token')) order.push(fetchInstructorDetails);
  if (sessionStorage.getItem('student_token')) order.push(fetchStudentDetails);

  // Fallback: add remaining fetchers for edge cases (e.g. fresh tab with no token hints)
  if (!order.includes(fetchStudentDetails)) order.push(fetchStudentDetails);
  if (!order.includes(fetchInstructorDetails)) order.push(fetchInstructorDetails);
  if (!order.includes(fetchAdminDetails)) order.push(fetchAdminDetails);

  return order;
};

// Check if user session exists and fetch the correct role's profile
export const checkLoggedInUser = () => async (dispatch) => {
  const { data, error } = await supabase.auth.getSession();

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

    const userId = data.session.user.id;
    const fetchOrder = getFetchOrder();

    for (const fetchFn of fetchOrder) {
      const res = await dispatch(fetchFn(userId));
      if (res.meta.requestStatus !== "rejected") return; // Found the correct profile
    }

    // All fetches failed — no profile found in any table
    dispatch(clearUser());
  } else {
    dispatch(clearUser());
  }
}

// Listen for Supabase Auth login/logout (session updates only)
// User profile fetching is handled by login pages (setUserAuthData)
// and ProtectedRoute (checkLoggedInUser) — NOT here, to avoid race conditions.
export const listenAuthChanges = () => (dispatch) => {
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      dispatch(setUser({ user: session.user, session }));
    } else {
      // Session ended — clear everything
      sessionStorage.removeItem('student_token');
      sessionStorage.removeItem('instructor_token');
      sessionStorage.removeItem('admin_token');
      dispatch(clearUser());
    }
  })
}

// Logout — clears ALL role tokens to prevent stale session conflicts
export const logoutUser = ({ user_type, status }) => async (dispatch) => {
  try {
    sessionStorage.removeItem('student_token');
    sessionStorage.removeItem('instructor_token');
    sessionStorage.removeItem('admin_token');

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
  isAuthChecked: false,
}

export const checkUserAuthSlice = createSlice({
  name: "checkUserAuthSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isUserAuth = true;
      state.session = action.payload.session;
      state.userError = null;
    },
    clearUser: (state) => {
      state.isUserAuth = false;
      state.userAuthData = undefined;
      state.session = undefined;
      state.userError = null;
      state.isAuthChecked = true;
    },
    // Called by login pages to immediately populate auth data
    // after a successful login — avoids the sequential fetch race condition
    setUserAuthData: (state, action) => {
      state.isUserAuth = true;
      state.userAuthData = action.payload;
      state.isAuthChecked = true;
      state.isUserLoading = false;
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
        state.isAuthChecked = true;
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
        state.isAuthChecked = true;
      })
      .addCase(fetchInstructorDetails.rejected, (state, action) => {
        state.isUserLoading = false;
        state.userError = action.payload || "Failed to fetch user details";
      })

      // fetch admin
      .addCase(fetchAdminDetails.pending, (state) => {
        state.isUserLoading = true;
      })
      .addCase(fetchAdminDetails.fulfilled, (state, action) => {
        state.isUserLoading = false;
        state.userAuthData = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchAdminDetails.rejected, (state, action) => {
        state.isUserLoading = false;
        state.userError = action.payload || "Failed to fetch user details";
        state.isAuthChecked = true;
      })
      .addCase("authSlice/updateLastSignInAt/fulfilled", (state, action) => {
        const updatedRow = Array.isArray(action.payload) ? action.payload[0] : action.payload;
        if (updatedRow && state.userAuthData && state.userAuthData.id === updatedRow.id) {
          state.userAuthData.last_login = updatedRow.last_login;
        }
      });
  },
})

export const { setUser, clearUser, setUserAuthData } = checkUserAuthSlice.actions;
export default checkUserAuthSlice.reducer;