import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

export const updatePurchasePaymentStatus = createAsyncThunk('purchaseSlice/updatePurchasePaymentStatus',
    async ({ orderId, payment_status }) => {
        // console.log('Received data in payment slice', orderId, payment_status);

        const res = await supabase.from('purchases').update({ payment_status: payment_status }).eq('razorpay_order_id', orderId).select().single();
        // console.log('Response from payment slice', res);

        if (res.error) throw res.error;

        return res.data;
    });

// fatch all purchase 
export const fetchPurchase = createAsyncThunk("purchaseSlice/fetchPurchase",
    async (_, { rejectWithValue }) => {
        try {
            const res = await supabase.from("purchases").select(`*,purchase_items (*,courses (*))`).order("created_at", { ascending: false });
            // console.log('Response for fetching all purchase', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// fetch user order 
export const fetchUserPurchase = createAsyncThunk("purchaseSlice/fetchUserPurchase",
    async ({ userId, status }, { rejectWithValue }) => {
        // console.log('Received data for fetching specific user course', userId, status);

        try {
            let query = supabase.from("purchases").select(`*,purchase_items (*,courses (*))`).eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (status) {
                query = query.eq("payment_status", status);
            }
            const res = await query;
            // console.log('Response for fetching specific user purchase', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// fetch course wise purchase details
export const fetchCoursePurchase = createAsyncThunk("purchaseSlice/fetchCoursePurchase",
    async ({ courseId }, { rejectWithValue }) => {
        // console.log('Received data for fetching specific user course', userId, status);

        try {
            const res = await supabase.from("purchase_items").select(`*,students (*)`).eq("course_id", courseId)
                .order("created_at", { ascending: false });

            // console.log('Response for fetching specific course purchase', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    isPurchaseLoading: false,
    getPurchaseData: [],
    hasPurchaseError: null
}

export const purchaseSlice = createSlice({
    name: 'purchaseSlice',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(updatePurchasePaymentStatus.pending, (state, action) => {
            state.isPurchaseLoading = true;
        })
        builder.addCase(updatePurchasePaymentStatus.fulfilled, (state, action) => {
            state.isPurchaseLoading = false;
            state.getPurchaseData = action.payload;
            state.hasPurchaseError = null;
        })
        builder.addCase(updatePurchasePaymentStatus.rejected, (state, action) => {
            state.isPurchaseLoading = false;
            state.getPurchaseData = [];
            state.hasPurchaseError = action.error?.message;
        })

         // fetch all purchase
            .addCase(fetchPurchase.pending, state => {
                state.isPurchaseLoading = true;
            })
            .addCase(fetchPurchase.fulfilled, (state, action) => {
                state.isPurchaseLoading = false;
                state.getPurchaseData = action.payload;
            })
            .addCase(fetchPurchase.rejected, (state, action) => {
                state.isPurchaseLoading = false;
                state.hasPurchaseError = action.payload;
            })

            // fetch user order
            .addCase(fetchUserPurchase.pending, state => {
                state.isPurchaseLoading = true;
            })
            .addCase(fetchUserPurchase.fulfilled, (state, action) => {
                state.isPurchaseLoading = false;
                state.getPurchaseData = action.payload;
            })
            .addCase(fetchUserPurchase.rejected, (state, action) => {
                state.isPurchaseLoading = false;
                state.hasPurchaseError = action.payload;
            })
            
            // fetch course order
            .addCase(fetchCoursePurchase.pending, state => {
                state.isPurchaseLoading = true;
            })
            .addCase(fetchCoursePurchase.fulfilled, (state, action) => {
                state.isPurchaseLoading = false;
                state.getPurchaseData = action.payload;
            })
            .addCase(fetchCoursePurchase.rejected, (state, action) => {
                state.isPurchaseLoading = false;
                state.hasPurchaseError = action.payload;
            });
    }
})

export default purchaseSlice.reducer;