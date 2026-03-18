import React from 'react';
import SectionContent from './section-content/SectionContent';

const CourseContent = ({ getSpecificCourseData, userAuthData, selectedCourse, getPurchaseData }) => {

  const courseSection = [
    { id: 1, title: 'Demo lecture video', type: 'demo' },
    { id: 2, title: 'Course lecture video', type: 'video' },
    { id: 3, title: 'Course document', type: 'document' },
    { id: 4, title: 'Certification test', type: 'exam' }
  ];

  const specificLecture = (sectionType) => {
    if (!Array.isArray(getSpecificCourseData)) return [];

    if (sectionType === 'demo') {
      return getSpecificCourseData.filter(v => v.type === 'video' && v.isPreview === true);
    }

    if (sectionType === 'video') {
      return getSpecificCourseData.filter(v => v.type === 'video' && v.isPreview === false);
    }

    return getSpecificCourseData.filter(v => v.type === sectionType);
  };

  return (
    <>
      {courseSection.map(section => (
        <SectionContent key={section.id} section={section} getSpecificCourseData={specificLecture(section.type)} userAuthData={userAuthData} selectedCourse={selectedCourse} getPurchaseData={getPurchaseData} />
      ))}
    </>
  );
};

export default CourseContent;
