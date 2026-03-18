import React, { useState } from 'react';
import UploadCourseLectureModal from '../modal/UploadCourseLectureModal';
import ShowCourseVideoModal from '../modal/ShowCourseVideoModal';
import InstructorSpecificCourseDetailsHeader from './details-comp/InstructorSpecificCourseDetailsHeader';
import InstructorSpecificCourseItemsRow from './details-comp/InstructorSpecificCourseItemsRow';
import { useCourseVideos } from '../../../../../tanstack/query/fetchLectureVideo';
import DeleteCourseAndLectureModal from '../modal/DeleteCourseAndLectureModal';

const InstructorSpecificCourseDetails = ({ selectedCourse, setSelectedCourse, setExpandedSections, editForm, setEditForm, setShowDeleteModal,
    expandedSections }) => {

    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: selectedCourse?.id });

    const [showVideoModal, setShowVideoModal] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(null);
    const [uploadForm, setUploadForm] = useState({ course_id: null, category_id: null, sectionType: null });
    const [updateData, setUpdateData] = useState(null);
    const [showDeleteLectureModal, setShowDeleteLectureModal] = useState(false);
    const [deletedData, setDeletedData] = useState({ lectureId: null, lectureName: null, doc_type: null, courseId: null, video_title: null });
    const deleteType = 'lecture';

    const courseSection = [{
        id: 1,
        title: 'Demo lecture video',
        type: 'demo'
    }, {
        id: 2,
        title: 'Course lecture video',
        type: 'video'
    }, {
        id: 3,
        title: 'Course document',
        type: 'document'
    }, {
        id: 4,
        title: 'Certification question set',
        type: 'exam'
    }]

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-7xl mx-auto">
                <InstructorSpecificCourseDetailsHeader lectureData={lectureData} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} editForm={editForm} setEditForm={setEditForm} setShowDeleteModal={setShowDeleteModal} />

                <div className="space-y-4">
                    {courseSection?.map(section => (
                        <InstructorSpecificCourseItemsRow key={section?.id} lectureData={lectureData} selectedCourse={selectedCourse} setUpdateData={setUpdateData} expandedSections={expandedSections} setExpandedSections={setExpandedSections} section={section} setDeletedData={setDeletedData} setShowVideoModal={setShowVideoModal}
                            setShowDeleteLectureModal={setShowDeleteLectureModal} uploadForm={uploadForm} setUploadForm={setUploadForm} setShowUploadModal={setShowUploadModal} />
                    ))}
                </div>
            </div>

            {/* Video Player Modal */}
            {showVideoModal && (
                <ShowCourseVideoModal showVideoModal={showVideoModal} setShowVideoModal={setShowVideoModal} />
            )}

            {/* Upload Video Modal */}
            {showUploadModal && (
                <UploadCourseLectureModal setShowUploadModal={setShowUploadModal} uploadForm={uploadForm} updateData={updateData} setUpdateData={setUpdateData} />
            )}

            {/* Delete Video Modal */}
            {showDeleteLectureModal && (
                <DeleteCourseAndLectureModal setShowDeleteLectureModal={setShowDeleteLectureModal} deletedData={deletedData} deleteType={deleteType} />
            )}
        </div>
    )
}

export default InstructorSpecificCourseDetails