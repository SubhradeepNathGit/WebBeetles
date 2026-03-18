import { useQuery } from "@tanstack/react-query";
import { fetchVideosByCourseId } from "../../function/getLectureVideo";

export const useCourseVideos = ({ courseId, status = null }) => {

    // console.log('Received data for fetching course related lecture', courseId);

    return useQuery({
        queryKey: ["course-videos", courseId, status],
        queryFn: () => fetchVideosByCourseId({ courseId, status }),
        enabled: !!courseId,
        // staleTime: 1000 * 60 * 5, 
    });
};
