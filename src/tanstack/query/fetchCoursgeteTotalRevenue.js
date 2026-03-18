import { useQuery } from "@tanstack/react-query";
import { getCourseTotalRevenue } from "../../function/getCourseRevenue";

export const useCourseRevenue = (courseId) => {
    return useQuery({
        queryKey: ["course-revenue", courseId],
        queryFn: () => getCourseTotalRevenue(courseId),
        enabled: !!courseId,         
        // staleTime: 5 * 60 * 1000,      
    });
};