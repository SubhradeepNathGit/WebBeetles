import { useQuery } from "@tanstack/react-query";
import { fetchCoursePurchases } from "../../function/getCoursePurchase";

export const useCoursePurchases = (courseId) => {
    return useQuery({
        queryKey: ["course-purchases", courseId],
        queryFn: () => fetchCoursePurchases(courseId),
        enabled: !!courseId,
        // staleTime: 1000 * 60 * 2,
    })
}