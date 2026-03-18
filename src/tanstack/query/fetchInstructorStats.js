import { useQuery } from "@tanstack/react-query";
import { getInstructorStats } from "../../function/getInstructorStats";

export const useInstructorStats = (instructorId) => {

    return useQuery({
        queryKey: ["instructorStats", instructorId],
        queryFn: () => getInstructorStats(instructorId),
        enabled: !!instructorId,
        // staleTime: 1000 * 60 * 5,
    });
};