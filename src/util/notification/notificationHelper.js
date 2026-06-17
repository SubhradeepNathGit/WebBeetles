import supabaseAdmin from '../supabase/supabaseAdmin';

/**
 * Insert a notification using the admin client (bypasses RLS).
 * This ensures notifications are always created regardless of
 * Row Level Security policies on the notifications table.
 *
 * @param {Object} params
 * @param {string} params.title     - Notification title
 * @param {string} params.message   - Notification body text
 * @param {string} params.type      - 'success' | 'info' | 'warning' | 'error'
 * @param {string} params.user_type - 'student' | 'admin' | 'instructor'
 * @param {string|null} params.user_id - Target user ID (null for broadcast to all of user_type)
 * @param {string} [params.link]    - Optional navigation link
 * @returns {Promise<Object|null>}  - The inserted row or null on failure
 */
export const createNotification = async ({ title, message, type = 'info', user_type, user_id = null, link = null }) => {
    try {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert({
                title,
                message,
                type,
                is_read: false,
                user_type,
                user_id,
                link,
            })
            .select()
            .single();

        if (error) {
            console.error('[Notification] Insert failed:', error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error('[Notification] Unexpected error:', err.message);
        return null;
    }
};
