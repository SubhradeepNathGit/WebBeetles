import { useQuery } from "@tanstack/react-query";
import { fetchInstructorCourses } from "../../function/getInstructorCourses";

export const useInstructorCourses = (instructorId) => {
    // console.log('Fetched instructor id', instructorId);

    return useQuery({
        queryKey: ["instructorCourses", instructorId],
        queryFn: () => fetchInstructorCourses(instructorId),
        enabled: !!instructorId,
        // staleTime: 1000 * 60 * 5, 
    });
};