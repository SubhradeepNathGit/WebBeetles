import { useQuery } from "@tanstack/react-query";
import { fetchUserCourseReview } from "../../function/getUserWiseSpecificCourseReview";

export const useUserCourseReview = ({ course_id, student_id }) => {
    // console.log('Receive data for fetching course review for a specific user in query', course_id, student_id);

    return useQuery({
        queryKey: ["user-course-review", course_id, student_id],
        queryFn: () => fetchUserCourseReview({ course_id, student_id }),
        enabled: !!course_id && !!student_id,
    });
};
