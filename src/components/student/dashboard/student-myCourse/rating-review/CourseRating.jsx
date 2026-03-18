import { Loader2, TriangleAlert } from "lucide-react";
import { useCourseReviews } from "../../../../../tanstack/query/fetchSpecificCourseReview";
import { useMemo } from "react";

const CourseRating = ({ courseId }) => {

    const { data: reviews = [], isLoading, isError } = useCourseReviews(courseId);

    const rating = useMemo(() => {
        if (!reviews.length) return '0.0';

        const total = reviews.reduce((acc, cur) => acc + Number(cur?.rating_count || 0),0);

        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    if (isLoading) {
        return <span><Loader2 className="w-3 h-3 animate-spin" /></span>;
    }

    if (isError) {
        return <span><TriangleAlert className="w-4 h-4 text-red-400" /></span>;
    }

    return <span>{rating}</span>;
};

export default CourseRating;