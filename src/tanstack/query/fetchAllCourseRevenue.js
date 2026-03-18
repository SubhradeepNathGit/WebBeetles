import { useQuery } from "@tanstack/react-query";
import { getAllCoursesRevenue } from "../../function/getAllCourseRevenue";

export const useAllCoursesRevenue = (courseIds) =>
    useQuery({
        queryKey: ["all-courses-revenue", courseIds],
        queryFn: () => getAllCoursesRevenue(courseIds),
        enabled: courseIds.length > 0,
        // staleTime: 5 * 60 * 1000,
    });