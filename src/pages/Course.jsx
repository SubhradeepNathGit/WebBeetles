import React from "react";
import CourseBanner from "../components/course/CourseBanner";
import CourseList from "../components/course/CourseList";
import PreFooterCTA from "../components/prefooter";

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