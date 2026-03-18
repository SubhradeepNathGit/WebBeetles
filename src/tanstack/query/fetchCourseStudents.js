import { useQuery } from "@tanstack/react-query";
import { getCourseStudents } from "../../function/getCourseStudents";

export const useCourseStudents = (instructorId) => {
    return useQuery({
        queryKey: ["instructorCourseStudents", instructorId],
        queryFn: () => getCourseStudents(instructorId),
        enabled: !!instructorId,
        // staleTime: 1000 * 60 * 5,
    });
};