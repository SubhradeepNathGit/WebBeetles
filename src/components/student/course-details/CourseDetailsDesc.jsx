import React, { useState } from 'react'
import AboutCourseDetails from './AboutCourseDetails';
import InstructorCourseDetails from './InstructorCourseDetails';

const CourseDetailsDesc = ({ courseData }) => {

    return (
        <div className='bg-black'>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:mx-32 md:mx-20 mx-10 text-white">

                <AboutCourseDetails courseData={courseData} />

                <InstructorCourseDetails courseData={courseData} />
            </section>
        </div>
    )
}

export default CourseDetailsDesc