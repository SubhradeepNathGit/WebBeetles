import { useQuery } from "@tanstack/react-query";
import { fetchCourseById } from "../../function/getSpecificCourseDetails";

export const useCourseDetails = (courseId) => {
//   console.log('Fetching details for course id in query', courseId);

    return useQuery({
        queryKey: ["course-details", courseId],
        queryFn: () => fetchCourseById(courseId),
        enabled: !!courseId,
        // staleTime: 1000 * 60 * 5,
    });
};
