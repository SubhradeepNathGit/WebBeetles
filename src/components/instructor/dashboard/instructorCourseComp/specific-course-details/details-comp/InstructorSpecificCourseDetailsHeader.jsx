import React, { useState } from 'react'
import UpdateCourseModal from '../../modal/UpdateCourseModal';
import DeleteCourseAndLectureModal from '../../modal/DeleteCourseAndLectureModal';
import { Award, CheckCheck, ChevronLeft, Clock, Edit2, Star, Trash2, Users } from 'lucide-react';
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
            {/* Back Button */}
            <button 
                onClick={() => setSelectedCourse(null)} 
                className="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-red-400 transition-all duration-300 mb-8 cursor-pointer"
            >
                <div className="w-8 h-8 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all duration-300">
                    <ChevronLeft className="w-4 h-4" />
                </div>
                Back to Courses
            </button>

            {/* Course Header Card */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/80 p-6 sm:p-8 mb-6 backdrop-blur-md shadow-2xl">
                {/* Subtle gradient glow */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative flex flex-col lg:flex-row items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
                            {selectedCourse?.title?.toUpperCase() ?? 'N/A'}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-zinc-400">
                            <span className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800/60">
                                <Users className="w-4 h-4 text-red-400" />
                                {students?.length?.toLocaleString() ?? 0} student{students?.length > 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800/60">
                                <Star className="w-4 h-4 text-amber-400" />
                                <CourseRating courseId={selectedCourse?.id} /> rating
                            </span>
                            <span className="flex items-center gap-2 bg-zinc-900/60 px-3 py-1.5 rounded-lg border border-zinc-800/60">
                                <Clock className="w-4 h-4 text-blue-400" />
                                {totalLectureTiming}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-shrink-0">
                        <button 
                            onClick={() => { setEditForm(selectedCourse); setShowEditModal(true); }} 
                            disabled={selectedCourse?.status != 'approved'} 
                            className={`group px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 border
                                ${selectedCourse?.status != 'approved' 
                                    ? 'cursor-not-allowed bg-zinc-800/50 border-zinc-700/50 text-zinc-500' 
                                    : 'cursor-pointer bg-zinc-900/80 border-zinc-700/60 text-zinc-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-white hover:shadow-lg hover:shadow-red-950/20 active:scale-95'}`}
                        >
                            <Edit2 className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                            Edit Course
                        </button>
                        <button 
                            onClick={() => { setShowDeleteModal(true); setDeletedData({ lectureId: selectedCourse?.id, lectureName: selectedCourse?.title, doc_type: selectedCourse?.type, courseId: null, video_title: null }); }}
                            disabled={selectedCourse?.status != 'approved'} 
                            className={`group px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 border
                                ${selectedCourse?.status != 'approved' 
                                    ? 'cursor-not-allowed bg-zinc-800/50 border-zinc-700/50 text-zinc-500' 
                                    : 'cursor-pointer bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 hover:shadow-lg hover:shadow-red-950/20 active:scale-95'}`}
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Mark Complete Button */}
                <div className="mt-6 pt-5 border-t border-zinc-800/60">
                    <button
                        disabled={!canMarkComplete} 
                        onClick={() => { if (!selectedCourse?.is_completed) { setMarkCourse(selectedCourse); setOpenMarkModal(true); } }}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 border
                            ${selectedCourse?.is_completed 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 cursor-default' 
                                : canMarkComplete 
                                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/20 active:scale-95' 
                                    : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-500 cursor-not-allowed'}`}
                    >
                        {selectedCourse?.is_completed ? (
                            <><Award className="w-5 h-5" /> Completed</>
                        ) : (
                            <><CheckCheck className="w-5 h-5" /> Mark Complete</>
                        )}
                    </button>
                </div>
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