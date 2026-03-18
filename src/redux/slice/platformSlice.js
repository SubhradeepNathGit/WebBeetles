import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// slice to fetch all platform details
export const fetchplatform = createAsyncThunk("platformSlice/fetchplatform",
    async (_, { rejectWithValue }) => {
        try {
            let res = await supabase.from("platform_settings").select("*");
            // console.log('Response for fetching all platform', res);

            if (res.error) return rejectWithValue(res.error.message);

            return res.data;
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// slice to update platform maintenance_mode
export const updateMaintenanceMode = createAsyncThunk("platformSlice/updateMaintenanceMode",
    async ({ id, updatedData }, { rejectWithValue }) => {
        // console.log('Updated maintenance details',id, updatedData);

        try {
            const res = await supabase.from("platform_settings").update({ maintenance_mode: updatedData }).eq("id", id).select();
            // console.log('Response for updating maintenance', res);

            if (res.error) return rejectWithValue(res.error.message);
            return res.data[0];

        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


const initialState = {
    allPlatformDetails: null,
    isPlatformLoading: false,
    hasPlatformError: null
}

export const platformSlice = createSlice({
    name: "platformSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // fetch all platform
            .addCase(fetchplatform.pending, (state) => {
                state.isPlatformLoading = true;
            })
            .addCase(fetchplatform.fulfilled, (state, action) => {
                state.isPlatformLoading = false;
                state.allPlatformDetails = action.payload;
            })
            .addCase(fetchplatform.rejected, (state, action) => {
                state.isPlatformLoading = false;
                state.hasPlatformError = action.payload;
            })

            // update platform
            .addCase(updateMaintenanceMode.pending, (state) => {
                state.isPlatformLoading = true;
            })
            .addCase(updateMaintenanceMode.fulfilled, (state, action) => {
                state.isPlatformLoading = false;
                // state.allPlatformDetails = action.payload;
            })
            .addCase(updateMaintenanceMode.rejected, (state, action) => {
                state.isPlatformLoading = false;
                state.hasPlatformError = action.payload;
            });
    },
});

export default platformSlice.reducer;