import React, { useEffect, useState } from "react";
import ApproveCourseHeader from "../../components/admin/approve-course/ApproveCourseHeader";
import ApproveCourseStats from "../../components/admin/approve-course/ApproveCourseStats";
import PendingTable from "../../components/admin/approve-course/PendingTable";
import LiveCourseTable from "../../components/admin/approve-course/live-course/LiveCourseTable";
import PreviewModal from "../../components/admin/approve-course/modal/previewModal";
import RejectedCourseTable from "../../components/admin/approve-course/reject-course/RejectedCourseTable";
import { useDispatch, useSelector } from "react-redux";
import { allCourse, updateCourseApproveReject, updateCourseBlockUnblockByAdmin } from "../../redux/slice/couseSlice";
import { Loader2 } from "lucide-react";
import VideoPlayerModal from "../../components/admin/approve-course/modal/VideoPlayerModal";
import ImageViewerModal from "../../components/admin/approve-course/modal/ImageViewerModal";
import ConfirmStatusModal from "../../components/admin/common/modal/ConfirmStatusModal";
import hotToast from "../../util/alert/hot-toast";
import getSweetAlert from "../../util/alert/sweetAlert";

const PENDING_COURSES = [
    { id: 1, title: "Flutter & Dart Complete Bootcamp", instructor: "Michael Chang", cat: "Development", submitted: "2024-02-25", duration: "18h 45m", modules: 12, price: "₹2,499", lessons: 148, level: "Beginner to Advanced", preview: "Build stunning mobile apps for iOS and Android with Flutter 3.0 and native Dart. Includes real-world e-commerce project build from scratch." },
    { id: 2, title: "AWS Certified Cloud Practitioner", instructor: "Dr. Sarah Jenkins", cat: "Cloud", submitted: "2024-02-24", duration: "24h 10m", modules: 16, price: "₹3,499", lessons: 192, level: "Beginner", preview: "Complete preparation for the AWS CCP exam. Covers core AWS services, billing, security, and cloud architecture with hands-on labs." },
    { id: 3, title: "Microsoft Excel for Finance Professionals", instructor: "Anita Desai", cat: "Finance", submitted: "2024-02-23", duration: "9h 30m", modules: 7, price: "₹1,499", lessons: 74, level: "Intermediate", preview: "Master financial modeling, pivot tables, and advanced Excel functions used in investment banking, FP&A, and corporate finance." },
    { id: 4, title: "Creative Video Editing with DaVinci Resolve", instructor: "Priya Mehra", cat: "Design", submitted: "2024-02-22", duration: "14h 20m", modules: 10, price: "₹1,999", lessons: 110, level: "Beginner to Advanced", preview: "Professional-grade video editing using the industry-leading DaVinci Resolve 18. Includes color grading, Fusion VFX, and Fairlight audio mixing." },
    { id: 11, title: "Flutter & Dart Complete Bootcamp", instructor: "Michael Chang", cat: "Development", submitted: "2024-02-25", duration: "18h 45m", modules: 12, price: "₹2,499", lessons: 148, level: "Beginner to Advanced", preview: "Build stunning mobile apps for iOS and Android with Flutter 3.0 and native Dart. Includes real-world e-commerce project build from scratch." },
    { id: 12, title: "AWS Certified Cloud Practitioner", instructor: "Dr. Sarah Jenkins", cat: "Cloud", submitted: "2024-02-24", duration: "24h 10m", modules: 16, price: "₹3,499", lessons: 192, level: "Beginner", preview: "Complete preparation for the AWS CCP exam. Covers core AWS services, billing, security, and cloud architecture with hands-on labs." },
    { id: 13, title: "Microsoft Excel for Finance Professionals", instructor: "Anita Desai", cat: "Finance", submitted: "2024-02-23", duration: "9h 30m", modules: 7, price: "₹1,499", lessons: 74, level: "Intermediate", preview: "Master financial modeling, pivot tables, and advanced Excel functions used in investment banking, FP&A, and corporate finance." },
    { id: 14, title: "Creative Video Editing with DaVinci Resolve", instructor: "Priya Mehra", cat: "Design", submitted: "2024-02-22", duration: "14h 20m", modules: 10, price: "₹1,999", lessons: 110, level: "Beginner to Advanced", preview: "Professional-grade video editing using the industry-leading DaVinci Resolve 18. Includes color grading, Fusion VFX, and Fairlight audio mixing." },
];

const APPROVED_COURSES = [
    { id: 10, title: "Advanced React Patterns", instructor: "Dr. Sarah Jenkins", cat: "Development", approvedDate: "2024-02-20", students: 2840, revenue: "₹1,42,000" },
    { id: 11, title: "Python for Data Science", instructor: "Michael Chang", cat: "Data", approvedDate: "2024-02-18", students: 2190, revenue: "₹1,09,500" },
    { id: 20, title: "Advanced React Patterns", instructor: "Dr. Sarah Jenkins", cat: "Development", approvedDate: "2024-02-20", students: 2840, revenue: "₹1,42,000" },
    { id: 21, title: "Python for Data Science", instructor: "Michael Chang", cat: "Data", approvedDate: "2024-02-18", students: 2190, revenue: "₹1,09,500" },
    { id: 30, title: "Advanced React Patterns", instructor: "Dr. Sarah Jenkins", cat: "Development", approvedDate: "2024-02-20", students: 2840, revenue: "₹1,42,000" },
    { id: 31, title: "Python for Data Science", instructor: "Michael Chang", cat: "Data", approvedDate: "2024-02-18", students: 2190, revenue: "₹1,09,500" },
];

export default function ApproveCourses() {

    const [search, setSearch] = useState("");
    const [preview, setPreview] = useState(null);
    const [videoModal, setVideoModal] = useState(null);
    const [videoTitle, setVideoTitle] = useState(null);
    const [imageModal, setImageModal] = useState(null);
    const [imageTitle, setImageTitle] = useState(null);
    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [courseId, setCourseId] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);
    const [openBlockUnblockModal, setOpenBlockUnblockModal] = useState(false);
    const [blockUnblockCourseId, setBlockUnblockCourseId] = useState(null);
    const [blockUnblockChangeStatus, setBlockUnblockChangeStatus] = useState(null);

    const dispatch = useDispatch(),
        { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course);

    useEffect(() => {
        dispatch(allCourse())
            .then(res => {
                // console.log('Response for fetching courses', res);
            })
            .catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    const handleUpdateStatus = () => {
        dispatch(updateCourseApproveReject({ id: courseId, status: changeStatus }))
            .then(res => {
                // console.log('Response for updating status', res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(allCourse());
                    hotToast(`Course ${changeStatus} successfully!`, "success");
                    setOpenMarkModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while ${changeStatus} the course.`, "error");
            })
    }

    const handleUpdateBlockUnblock = () => {
        dispatch(updateCourseBlockUnblockByAdmin({ id: blockUnblockCourseId, status: blockUnblockChangeStatus == 'block' }))
            .then(res => {
                // console.log('Response for updating status', res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(allCourse());
                    hotToast(`Course ${blockUnblockChangeStatus == 'block' ? 'block' : 'unblock'} successfully!`, "success");
                    setOpenBlockUnblockModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while ${!blockUnblockChangeStatus != 'block' ? 'block' : 'unblock'} the course.`, "error");
            })
    }

    const pending = getCourseData?.filter(c => c?.status == 'pending');
    const approved = getCourseData?.filter(c => c?.status == 'approved');
    const rejected = getCourseData?.filter(c => c?.status == 'rejected');

    const filtered = pending?.filter(i => i?.title?.toLowerCase()?.includes(search?.toLowerCase()));

    // console.log('All available course', approved);

    return (
        <div className="space-y-6">
            <ApproveCourseHeader search={search} setSearch={setSearch} />

            {/* Counts */}
            <ApproveCourseStats pending={pending} approved={approved} rejected={rejected} isCourseLoading={isCourseLoading} />

            {/* Pending Table */}
            {isCourseLoading ? <Loader2 className="inline animate-spin my-5 mx-50 w-12 h-12" /> : 
                <PendingTable pending={filtered} setPreview={setPreview} setCourseId={setCourseId} setChangeStatus={setChangeStatus}
                    setOpenMarkModal={setOpenMarkModal} />}

            {/* Approved Courses List */}
            {isCourseLoading ? <Loader2 className="inline animate-spin my-5 mx-50 w-12 h-12" /> :
            <LiveCourseTable approved={approved} setOpenBlockUnblockModal={setOpenBlockUnblockModal} setBlockUnblockCourseId={setBlockUnblockCourseId}
                setBlockUnblockChangeStatus={setBlockUnblockChangeStatus} />}

            {/* Rejected Courses List */}
            {isCourseLoading ? <Loader2 className="inline animate-spin my-5 mx-50 w-12 h-12" /> : <RejectedCourseTable rejected={rejected} />}

            {/* Preview Modal */}
            {preview && (
                <PreviewModal preview={preview} setPreview={setPreview} setVideoModal={setVideoModal} setImageModal={setImageModal}
                    setVideoTitle={setVideoTitle} setImageTitle={setImageTitle} setCourseId={setCourseId} setChangeStatus={setChangeStatus}
                    setOpenMarkModal={setOpenMarkModal} />
            )}

            {/* Video Modal */}
            {videoModal && (
                <VideoPlayerModal videoUrl={videoModal} onClose={setVideoModal} setVideoTitle={setVideoTitle} title={videoTitle} />
            )}

            {/* Thumbnail Modal */}
            {imageModal && (
                <ImageViewerModal imageUrl={imageModal} onClose={setImageModal} title={imageTitle} setImageTitle={setImageTitle} />
            )}

            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={handleUpdateStatus} isLoading={isCourseLoading}
                    title={`${changeStatus == 'approved' ? 'Approve' : 'Reject'} Course`} subTitle={`Are you sure you want to ${changeStatus == 'approved' ? 'approve' : 'reject'} the course`} />
            )}

            {openBlockUnblockModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenBlockUnblockModal} handleMark={handleUpdateBlockUnblock} isLoading={isCourseLoading}
                    title={`${blockUnblockChangeStatus == 'block' ? 'Block' : 'Unblock'} Course`} subTitle={`Are you sure you want to ${blockUnblockChangeStatus == 'block' ? 'block' : 'unblock'} the course`} />
            )}
        </div>
    );
}
