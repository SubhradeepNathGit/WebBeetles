import supabase from "../util/supabase/supabase";

export const fetchUserCourseReview = async ({ course_id, student_id }) => {
    // console.log('Receive data for fetching course review for a specific user', course_id, student_id);

    if (!course_id || !student_id)
        throw new Error("course_id and student_id are required");

    const res = await supabase.from("course_reviews").select("*").eq("course_id", course_id)
        .eq("student_id", student_id).single();
    // console.log('Response for fetching course review for a specific user', res);

    if (res?.error && res?.error.code !== "PGRST116") {
        throw new Error(res?.error.message);
    }

    return res?.data;
};
