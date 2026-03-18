import supabase from "../util/supabase/supabase";

export const getUserWisePurchaseCourseDetails = async (student_id ) => {
    // console.log('Receive data for fetching course review for a specific user', student_id);

    if (!student_id)
        throw new Error("student_id are required");

    const res = await supabase.from('purchase_items').select(`id,is_exam_completed,purchases!inner (*),
    courses (*)`).eq('purchases.user_id', student_id);

    // console.log('Response for fetching course details for a specific user', res);

    if (res?.error && res?.error.code !== "PGRST116") {
        throw new Error(res?.error.message);
    }

    return res?.data;
};
