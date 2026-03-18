import React from 'react'
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import hotToast from '../../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../../util/alert/sweetAlert';
import { allCourse, updateCourseBlockUnblock, updateCourseCompletion } from '../../../../../redux/slice/couseSlice';

const ConfirmCompleteBlockUnblockModal = ({ markType, setOpenMarkModal, setSelectedCourse, markCourse, setMarkCourse }) => {

    const dispatch = useDispatch();
    const { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course),
        { isUserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);

    const handleMark = () => {
        dispatch(markType == 'complete' ? updateCourseCompletion({ id: markCourse?.id, is_completed: true }) :
            updateCourseBlockUnblock({ id: markCourse?.id, status: !markCourse?.is_active }))
            .then(res => {
                // console.log(`Response after mark complete lecture`, res);

                if (res.meta.requestStatus === "fulfilled") {

                    setMarkCourse(null);
                    setOpenMarkModal(false);

                    dispatch(allCourse({ instructor_id: userAuthData?.id }));

                    if (markType == 'complete') {
                        setSelectedCourse(prev => ({
                            ...prev,
                            is_completed: true
                        }))
                    }

                    hotToast(`Course ${markType == 'complete' ? 'mark completed' : markCourse?.is_active ? 'blocked' : 'unblocked'} successfully!`, "success");
                } else {
                    hotToast(`Failed to ${markType == 'complete' ? 'mark completed' : markCourse?.is_active ? 'block' : 'unblock'}. Try again.`, "error");
                }
            })
            .catch(error => {
                console.error("Error while marked course:", error);
                getSweetAlert("Error", `Something went wrong while ${markType == 'complete' ? 'mark compliting' : markCourse?.is_active ? 'blocking' : 'unblocking'} the course.`, "error");
            })
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-800">
                <h2 className="text-2xl font-bold mb-4">{markType == 'complete' ? 'Mark Complete' : markCourse?.is_active ? 'Draft' : 'Active'}?</h2>
                <p className="text-gray-400 mb-6">Are you sure you want to {markType == 'complete' ? 'mark complete' : markCourse?.is_active ? 'block' : 'unblock'} "{markCourse?.title}"? {markType == 'complete' ? "You can't upload new lecture or change existing after this."
                    : "Student can't see the course."}</p>
                <div className="flex gap-3">
                    <button disabled={isCourseLoading} onClick={() => handleMark()} className={`flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors ${isCourseLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        {isCourseLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : ''} Confirm
                    </button>
                    <button disabled={isCourseLoading} onClick={() => setOpenMarkModal(false)} className={`flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors ${isCourseLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmCompleteBlockUnblockModal