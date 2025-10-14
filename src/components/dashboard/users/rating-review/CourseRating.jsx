import { useQuery } from "@tanstack/react-query";
import { fetchCourseDetails } from "../../../../common-query/query";

const CourseRating = ({ courseId }) => {

    const calculateRating = (courseData) => {
        if (courseData?.ratings) {

            const noRating = courseData?.ratings.length;
            let totalRatings = 0;
            courseData?.ratings.forEach(element => {
                totalRatings += Number.parseInt(element.value);
            });

            const rating = totalRatings / noRating;

            return rating ? rating.toFixed(1) : '0.0';
        }
    }

    const { data, isLoading, isError } = useQuery({
        queryKey: ['course-rating', courseId],
        queryFn: () => fetchCourseDetails(courseId),
    });

    if (isLoading) return <span>Loading...</span>;
    if (isError) return <span>Error</span>;

    const rating = calculateRating(data?.data);
    return <span>{rating}</span>;
};

export default CourseRating;