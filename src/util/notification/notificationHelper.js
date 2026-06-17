import supabase from '../supabase/supabase';
import supabaseAdmin from '../supabase/supabaseAdmin';

/**
 * Insert a notification through the server-side Edge Function when deployed.
 * Falls back to a direct insert so local/dev projects keep working with RLS policies.
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
    if (!title || !message || !user_type) {
        console.error('[Notification] Missing required notification fields:', { title, message, user_type });
        return null;
    }

    const payload = {
        title,
        message,
        type,
        is_read: false,
        user_type,
        user_id,
        link,
    };

    try {
        const { data: functionData, error: functionError } = await supabase.functions.invoke('create-notification', {
            body: payload,
        });

        if (!functionError && functionData) {
            return functionData;
        }

        if (functionError) {
            console.warn('[Notification] Edge Function unavailable, falling back to direct insert:', functionError.message);
        }

        const { data, error } = await supabaseAdmin
            .from('notifications')
            .insert(payload)
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

export const createAudienceNotifications = async ({ student, admin }) => {
    const notifications = [student, admin].filter(Boolean);
    const results = await Promise.allSettled(
        notifications.map(notification => createNotification(notification))
    );

    const failed = results.filter(result => result.status === 'rejected' || !result.value);
    if (failed.length > 0) {
        console.error(`[Notification] ${failed.length} notification(s) failed to send.`);
    }

    return results.map(result => result.status === 'fulfilled' ? result.value : null);
};
