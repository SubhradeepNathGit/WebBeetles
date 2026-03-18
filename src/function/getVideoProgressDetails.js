import supabase from "../util/supabase/supabase";

export const fetchLectureProgress = async ({ student_id, course_id, lesson_id, type }) => {

    // console.log('Receive data for fetching lecture progress', student_id, course_id, lesson_id, type);

    if (!student_id || !course_id) {
        throw new Error("student_id and course_id are required");
    }

    let query = supabase.from("video_progress").select("*").eq("student_id", student_id).eq("course_id", course_id);

    if (lesson_id) {
        query = query.eq("lesson_id", lesson_id);
    }

    if (type) {
        query = query.eq("type", type);
    }

    const res = await query;
    // console.log('Response for lecture progress status', res);

    if (res?.error) throw res?.error;

    return res?.data;
};