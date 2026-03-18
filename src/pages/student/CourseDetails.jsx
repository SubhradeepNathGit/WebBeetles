import React from "react";
import { useParams } from "react-router-dom";
import CourseDetailsBanner from "../../components/student/course-details/CourseDetailsBanner";
import CourseDetailsDesc from "../../components/student/course-details/CourseDetailsDesc";
import { decodeBase64Url } from "../../util/encodeDecode/base64";
import Lottie from "lottie-react";
import loaderAnimation from "./../../assets/animations/loader.json"
import { useCourseDetails } from "../../tanstack/query/fetchSpecificCourseDetails";

const CourseDetails = () => {

    const { courseId } = useParams();
    const course_id = decodeBase64Url(courseId);

    const { isLoading, data: courseData, error } = useCourseDetails(course_id);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <Lottie
                    animationData={loaderAnimation}
                    loop={true}
                    className="w-40 h-40 sm:w-52 sm:h-52"
                />
            </div>
        )
    }
    return (
        <>
            <CourseDetailsBanner />
            <CourseDetailsDesc courseData={courseData} />
        </>
    )
}

export default CourseDetails;



