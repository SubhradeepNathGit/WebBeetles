import { useQuery } from "@tanstack/react-query";
import { fetchStudentDetails } from "../../function/getSpecificStudentDetails";

// Hook to fetch student details by ID
export const useStudentDetails = (studentId) => {

    return useQuery({
        queryKey: ["student-details", studentId],
        queryFn: () => fetchStudentDetails(studentId),
        enabled: !!studentId,
    });
};
