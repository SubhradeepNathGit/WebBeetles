import { useQuery } from "@tanstack/react-query";
import { fetchCourseReviews } from "../../function/getSpecificCourseReview";

export const useCourseReviews = (course_id) => {
    // console.log('Receive data for fetching course review in query', course_id);

    return useQuery({
        queryKey: ["course-reviews", course_id],
        queryFn: () => fetchCourseReviews(course_id),
        enabled: !!course_id,
    });
};