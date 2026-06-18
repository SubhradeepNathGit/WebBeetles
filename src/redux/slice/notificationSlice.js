import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabaseAdmin from "../../util/supabase/supabaseAdmin";

const buildNotificationQuery = ({ user_type = 'admin', user_id = null, limit = 50 } = {}) => {
    let query = supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('user_type', user_type)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (user_id) {
        query = query.or(`user_id.eq.${user_id},user_id.is.null`);
    } else {
        query = query.is('user_id', null);
    }

    return query;
};

const getNotificationContext = ({ user_type = 'admin', user_id = null } = {}) => ({
    user_type,
    user_id: user_id || null,
});

const belongsToContext = (notification, context) => {
    if (!notification || !context) return false;
    if (notification.user_type !== context.user_type) return false;
    if (!context.user_id) return !notification.user_id;
    return !notification.user_id || notification.user_id === context.user_id;
};

const sortNotifications = (notifications) => (
    [...notifications].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
);

const recalculateUnreadCount = (notifications) => notifications.filter(n => !n.is_read).length;

// Fetch latest notifications for the active notification audience.
export const fetchNotifications = createAsyncThunk('notificationSlice/fetchNotifications',
    async (params = {}, { rejectWithValue }) => {
        const context = getNotificationContext(params);
        const res = await buildNotificationQuery(params);

        if (res?.error) {
            console.error('Error fetching notifications:', res?.error);
            return rejectWithValue(res?.error?.message || 'Failed to fetch notifications');
        }

        return {
            context,
            notifications: res?.data || [],
        };
    }
);

// Mark a single notification as read
export const markNotificationRead = createAsyncThunk('notificationSlice/markNotificationRead',
    async (id, { rejectWithValue }) => {
        const res = await supabaseAdmin
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
        let query = supabaseAdmin
            .from('notifications')
            .update({ is_read: true })
            .eq('is_read', false)
            .eq('user_type', user_type);

        if (user_id) {
            query = query.or(`user_id.eq.${user_id},user_id.is.null`);
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
    notificationError: null,
    context: null
};

export const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState,
    reducers: {
        addRealtimeNotification: (state, action) => {
            if (!belongsToContext(action.payload, state.context)) return;

            const index = state.notifications.findIndex(n => n.id === action.payload.id);
            if (index >= 0) {
                state.notifications[index] = action.payload;
            } else {
                state.notifications = [action.payload, ...state.notifications].slice(0, 50);
            }
            state.notifications = sortNotifications(state.notifications);
            state.unreadCount = recalculateUnreadCount(state.notifications);
        },
        removeRealtimeNotification: (state, action) => {
            state.notifications = state.notifications.filter(n => n.id !== action.payload);
            state.unreadCount = recalculateUnreadCount(state.notifications);
        },
        resetNotifications: () => initialState,
        setNotificationContext: (state, action) => {
            state.context = getNotificationContext(action.payload);
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
                state.context = action.payload.context;
                state.notifications = sortNotifications(action.payload.notifications);
                state.unreadCount = recalculateUnreadCount(action.payload.notifications);
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
                const updatedById = new Map((action.payload || []).map(n => [n.id, n]));
                state.notifications = state.notifications.map(n => (
                    updatedById.get(n.id) || { ...n, is_read: true }
                ));
                state.unreadCount = recalculateUnreadCount(state.notifications);
            });
    }
});

export const { addRealtimeNotification, removeRealtimeNotification, resetNotifications, setNotificationContext } = notificationSlice.actions;
export default notificationSlice.reducer;
