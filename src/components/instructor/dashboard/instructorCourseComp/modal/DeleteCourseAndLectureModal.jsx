import React from 'react'
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { deleteLecture } from '../../../../../redux/slice/videoSlice';
import hotToast from '../../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import { Loader2 } from 'lucide-react';
import { allCourse, deleteCourse } from '../../../../../redux/slice/couseSlice';

const DeleteCourseAndLectureModal = ({ setShowDeleteLectureModal, deletedData, deleteType, onDeleted }) => {

    const dispatch = useDispatch();
    const queryClient = useQueryClient();
    const { isVideoLoading, videoData, hasVideoError } = useSelector(state => state?.lecture),
        { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course),
        { isUserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);

    const handleDeleteVideo = () => {
        dispatch(deleteType == 'lecture' ? deleteLecture({ lectureId: deletedData?.lectureId, lectureName: deletedData?.lectureName, doc_type: deletedData?.doc_type })
            : deleteCourse({ id: deletedData?.lectureId }))
            .then(res => {
                // console.log(`Response after deleting lecture`, res);

                if (res.meta.requestStatus === "fulfilled") {
                    if (deleteType == 'lecture') {
                        queryClient.invalidateQueries({
                            queryKey: ['course-videos', deletedData?.courseId],
                        });
                    }
                    else {
                        onDeleted();
                        window.dispatchEvent(new CustomEvent('open-instructor-course'));

                        dispatch(allCourse({ instructor_id: userAuthData?.id }));
                    }

                    setShowDeleteLectureModal(false);
                    hotToast(`${deleteType?.charAt(0)?.toUpperCase() + deleteType?.slice(1)?.toLowerCase()} deleted successfully!`, "success");

                } else {
                    hotToast(`Failed to delete ${deleteType}. Try again.`, "error");
                }
            })
            .catch(error => {
                console.error("Error while submitting course:", error);
                getSweetAlert("Error", `Something went wrong while deleting the ${deleteType}.`, "error");
            })
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-800">
                <h2 className="text-2xl font-bold mb-4">Delete {deleteType == 'lecture' ? 'Lecture' : 'Course'}?</h2>
                <p className="text-gray-400 mb-6">Are you sure you want to delete "{deletedData?.video_title || deletedData?.title || deletedData?.lectureName}"? This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button disabled={isVideoLoading || isCourseLoading} onClick={() => handleDeleteVideo()} className={`flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors ${(isVideoLoading || isCourseLoading) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        {(isVideoLoading || isCourseLoading) ? <Loader2 className="w-4 h-4 animate-spin inline" /> : ''} Delete
                    </button>
                    <button disabled={isVideoLoading || isCourseLoading} onClick={() => setShowDeleteLectureModal(false)} className={`flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors ${(isVideoLoading || isCourseLoading) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteCourseAndLectureModal