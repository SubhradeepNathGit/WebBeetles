import supabase from "../util/supabase/supabase";

export const getInstructorAverageRating = async (instructorId) => {
    if (!instructorId) return 0;

    // Get instructor courses
    const { data: courses, error: courseError } = await supabase.from("courses").select("id").eq("instructor_id", instructorId).eq("is_deleted", false);

    if (courseError || !courses?.length) {
        console.error(courseError);
        return 0;
    }

    const courseIds = courses.map(c => c.id);

    // Get reviews for those courses
    const { data: reviews, error: reviewError } = await supabase.from("course_reviews").select("rating_count").in("course_id", courseIds);

    if (reviewError || !reviews?.length) {
        console.error(reviewError);
        return 0;
    }

    const totalRating = reviews.reduce((sum, r) => sum + Number(r.rating_count), 0);

    const avgRating = totalRating / reviews.length;

    return Number(avgRating.toFixed(1));
};
