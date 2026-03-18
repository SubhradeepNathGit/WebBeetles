import React, { useState } from 'react'
import UpdateCourseModal from '../../modal/UpdateCourseModal';
import DeleteCourseAndLectureModal from '../../modal/DeleteCourseAndLectureModal';
import { Award, CheckCheck, ChevronRight, Clock, Edit2, Star, Trash2, Users } from 'lucide-react';
import ConfirmCompleteBlockUnblockModal from '../../modal/ConfirmCompleteBlockUnblockModal';
import { formatToHHMMSS } from '../../../../../../util/timeFormat/timeFormat';
import CourseRating from '../../../../../student/dashboard/student-myCourse/rating-review/CourseRating';
import { useCoursePurchases } from '../../../../../../tanstack/query/fetchCoursePurchase';

const InstructorSpecificCourseDetailsHeader = ({ lectureData, selectedCourse, setSelectedCourse, editForm, setEditForm }) => {

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [deletedData, setDeletedData] = useState(null);
    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [markCourse, setMarkCourse] = useState(null);
    const deleteType = 'course', markType = 'complete';

    const totalSeconds = lectureData?.reduce((acc, value) => acc + Number(value?.duration || 0), 0) || 0;
    const totalLectureTiming = formatToHHMMSS(totalSeconds);

    const canMarkComplete = selectedCourse?.status === "approved" && selectedCourse?.is_completed === false;
    const { data: students, isLoading: isStudentLoading } = useCoursePurchases(selectedCourse?.id);

    return (
        <>
            <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6 cursor-pointer">
                <ChevronRight className="w-5 h-5 rotate-180" />
                Back to Courses
            </button>

            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-3">{selectedCourse?.title?.toUpperCase() ?? 'N/A'}</h1>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-2"><Users className="w-4 h-4" />{students?.length?.toLocaleString() ?? 0} student{students?.length > 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-2"><Star className="w-4 h-4" /><CourseRating courseId={selectedCourse?.id} /> rating</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{totalLectureTiming}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => { setEditForm(selectedCourse); setShowEditModal(true); }} disabled={selectedCourse?.status != 'approved'} className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2
                        ${selectedCourse?.status != 'approved' ? 'cursor-not-allowed bg-purple-500' : 'cursor-pointer bg-purple-600 hover:bg-purple-700'}`}>
                        <Edit2 className="w-4 h-4" />
                        Edit Course
                    </button>
                    <button onClick={() => { setShowDeleteModal(true); setDeletedData({ lectureId: selectedCourse?.id, lectureName: selectedCourse?.title, doc_type: selectedCourse?.type, courseId: null, video_title: null }); }}
                        disabled={selectedCourse?.status != 'approved'} className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 
                    ${selectedCourse?.status != 'approved' ? 'cursor-not-allowed bg-red-400' : 'cursor-pointer bg-red-600 hover:bg-red-700'}`}>
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <button
                    disabled={!canMarkComplete} onClick={() => { if (!selectedCourse?.is_completed) { setMarkCourse(selectedCourse); setOpenMarkModal(true); } }}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${canMarkComplete
                        ? 'bg-green-600 cursor-pointer hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed opacity-60 text-green-200'}`}>
                    {selectedCourse?.is_completed ? (
                        <><Award /> Completed</>) : (
                        <>
                            <CheckCheck className="w-5 h-5" />
                            Mark Complete
                        </>
                    )}
                </button>
            </div>

            {/* Delete Course Modal */}
            {showDeleteModal && (
                <DeleteCourseAndLectureModal setShowDeleteLectureModal={setShowDeleteModal} deletedData={deletedData} deleteType={deleteType} onDeleted={() => setSelectedCourse(null)} />
            )}

            {/* Edit Course Modal */}
            {showEditModal && (
                <UpdateCourseModal setShowEditModal={setShowEditModal} editForm={editForm} setEditForm={setEditForm} />
            )}

            {/* mark complete Course Modal */}
            {openMarkModal && (
                <ConfirmCompleteBlockUnblockModal markType={markType} setOpenMarkModal={setOpenMarkModal} setSelectedCourse={setSelectedCourse} markCourse={markCourse} setMarkCourse={setMarkCourse} />
            )}
        </>
    )
}

export default InstructorSpecificCourseDetailsHeader