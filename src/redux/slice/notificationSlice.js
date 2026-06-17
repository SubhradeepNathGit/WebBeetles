import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/supabase/supabase";

// Fetch latest 20 notifications
export const fetchNotifications = createAsyncThunk('notificationSlice/fetchNotifications',
    async ({ user_type = 'admin', user_id = null } = {}, { rejectWithValue }) => {
        let query = supabase
            .from('notifications')
            .select('*')
            .eq('user_type', user_type)
            .order('created_at', { ascending: false })
            .limit(20);

        if (user_id) {
            query = query.eq('user_id', user_id);
        }

        const res = await query;

        if (res?.error) {
            console.error('Error fetching notifications:', res?.error);
            return rejectWithValue(res?.error?.message || 'Failed to fetch notifications');
        }

        return res?.data || [];
    }
);

// Mark a single notification as read
export const markNotificationRead = createAsyncThunk('notificationSlice/markNotificationRead',
    async (id, { rejectWithValue }) => {
        const res = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id)
            .select()
            .single();

        if (res?.error) {
            console.error('Error marking notification read:', res?.error);
            return rejectWithValue(res?.error?.message || 'Failed to mark notification as read');
        }

        return res?.data;
    }
);

// Mark all unread notifications as read
export const markAllNotificationsRead = createAsyncThunk('notificationSlice/markAllNotificationsRead',
    async ({ user_type = 'admin', user_id = null } = {}, { rejectWithValue }) => {
        let query = supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('is_read', false)
            .eq('user_type', user_type);

        if (user_id) {
            query = query.eq('user_id', user_id);
        }

        const res = await query.select();

        if (res?.error) {
            console.error('Error marking all notifications read:', res?.error);
            return rejectWithValue(res?.error?.message || 'Failed to mark all notifications as read');
        }

        return res?.data || [];
    }
);

const initialState = {
    isNotificationLoading: false,
    notifications: [],
    unreadCount: 0,
    notificationError: null
};

export const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState,
    reducers: {
        addRealtimeNotification: (state, action) => {
            const exists = state.notifications.some(n => n.id === action.payload.id);
            if (!exists) {
                state.notifications = [action.payload, ...state.notifications];
                if (!action.payload.is_read) {
                    state.unreadCount += 1;
                }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.isNotificationLoading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isNotificationLoading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.is_read).length;
                state.notificationError = null;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isNotificationLoading = false;
                state.notificationError = action.payload || action.error?.message;
            })

            // Mark single notification read
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                const updatedNotification = action.payload;
                if (updatedNotification) {
                    state.notifications = state.notifications.map(n => 
                        n.id === updatedNotification.id ? updatedNotification : n
                    );
                    state.unreadCount = state.notifications.filter(n => !n.is_read).length;
                }
            })

            // Mark all notifications read
            .addCase(markAllNotificationsRead.fulfilled, (state, action) => {
                state.notifications = state.notifications.map(n => ({
                    ...n,
                    is_read: true
                }));
                state.unreadCount = 0;
            });
    }
});

export const { addRealtimeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
