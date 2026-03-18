import supabase from "../util/supabase/supabase";

export const fetchCoursePurchases = async (courseId) => {
    if (!courseId) return [];
    // console.log('Fetch purchase item Id', courseId);

    const res = await supabase.from("purchase_items").select('*').eq("course_id", courseId).order("created_at", { ascending: false });
    // console.log('Response for fetching purchase item', res);

    if (res?.error) throw new Error(res?.error.message);

    return res?.data;
};