import supabaseAdmin from "../util/supabase/supabaseAdmin";

export const fetchCourseReviews = async (course_id) => {
    // console.log('Receive data for fetching course review', course_id);

    if (!course_id) throw new Error("course_id is required");

    const res = await supabaseAdmin.from("course_reviews").select("*").eq("course_id", course_id)
        .order("created_at", { ascending: false });
    // console.log('Response for fetching course wise review', res);

    if (res?.error) throw new Error(res?.error.message);

    return res?.data;
};
