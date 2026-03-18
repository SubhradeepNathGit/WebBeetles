import { useQuery } from "@tanstack/react-query";
import { getUserWisePurchaseCourseDetails } from "../../function/getUserWisePurchaseCourseDetails";

// Hook to fetch student details by ID
export const useUserWisePurchaseCourseDetails = (studentId) => {

    return useQuery({
        queryKey: ["student-purchase-details", studentId],
        queryFn: () => getUserWisePurchaseCourseDetails(studentId),
        enabled: !!studentId,
    });
};
