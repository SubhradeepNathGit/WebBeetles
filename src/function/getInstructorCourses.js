import supabase from "../util/supabase/supabase";

export const fetchInstructorCourses = async (instructorId) => {
    if (!instructorId) throw new Error("Instructor ID is required");

    const res = await supabase.from("courses").select("*").eq("instructor_id", instructorId);
    // console.log('Response for fetching instructor-wise course details', res?.data);

    if (res?.error) {
        throw new Error(res?.error.message);
    }

    return res?.data;
};