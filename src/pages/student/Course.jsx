import React from "react";
import CourseBanner from "../../components/student/course/CourseBanner";
import CourseList from "../../components/student/course/CourseList";
import PreFooterCTA from "../../components/student/common/prefooter";

const Course = () => {
    return (
        <>
            <CourseBanner />
            <CourseList />
            <PreFooterCTA />
        </>
    )
}

export default Course;