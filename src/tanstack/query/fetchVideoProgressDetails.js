import { useQuery } from "@tanstack/react-query";
import { fetchLectureProgress } from "../../function/getVideoProgressDetails";

export const useLectureProgress = ({ student_id, course_id, lesson_id, type, isPlaying }) => {
    return useQuery({
        queryKey: ["lecture-progress", student_id, course_id, lesson_id || "all", type || "all"],
        queryFn: () => fetchLectureProgress({ student_id, course_id, lesson_id, type }),
        enabled: Boolean(student_id && course_id) || !isPlaying,
        // staleTime: 30 * 1000, 
        // refetchOnWindowFocus: false,
    });
};
