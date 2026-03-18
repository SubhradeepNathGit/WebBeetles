import React, { useEffect, useState } from "react";
import InstructorReviewHeader from "../../components/admin/instructor-review/InstructorReviewHeader";
import StatsCounter from "../../components/admin/instructor-review/StatsCounter";
import ApplicationTable from "../../components/admin/instructor-review/ApplicationTable";
import DocumentViewerModal from "../../components/admin/instructor-review/modal/DocumentViewerModal";
import ProfileModal from "../../components/admin/instructor-review/modal/ProfileModal";
import { useDispatch, useSelector } from "react-redux";
import { allInstructor, updateInstructorApproveRejectStatus } from "../../redux/slice/instructorSlice";
import ConfirmStatusModal from "../../components/admin/common/modal/ConfirmStatusModal";
import hotToast from "../../util/alert/hot-toast";
import getSweetAlert from "../../util/alert/sweetAlert";
import { Loader2 } from "lucide-react";

export default function InstructorReviews() {

    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);
    const [docViewer, setDocViewer] = useState(null);
    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [instructorId, setInstructorId] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);

    const dispatch = useDispatch(),
        { isInstructorLoading, getInstructorData, isInstructorError } = useSelector(state => state?.instructor);

    const pendingRequest = getInstructorData?.filter(inst => inst?.application_status == 'pending');

    const filtered = pendingRequest?.filter(i => i?.name?.toLowerCase()?.includes(search?.toLowerCase()) || i?.email?.toLowerCase()?.includes(search?.toLowerCase()));

    useEffect(() => {
        dispatch(allInstructor())
            .then(res => {
                // console.log('Response for fetching all instructor', res)
            }).catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    const handleUpdateStatus = () => {
        dispatch(updateInstructorApproveRejectStatus({ id: instructorId, status: changeStatus }))
            .then(res => {
                // console.log('Response for updating status', res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(allInstructor());
                    hotToast(`Instructor ${changeStatus} successfully!`, "success");
                    setOpenMarkModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while ${changeStatus} the instructor.`, "error");
            })
    }

    // console.log('Instructor list', pendingRequest);

    return (
        <div className="space-y-6">
            <InstructorReviewHeader search={search} setSearch={setSearch} />

            {/* Status counters */}
            <StatsCounter isInstructorLoading={isInstructorLoading} getInstructorData={getInstructorData} />

            {/* Applications Table */}
            {isInstructorLoading ? <Loader2 className="inline animate-spin my-5 mx-50 w-12 h-12" /> :
                <ApplicationTable filtered={filtered} setModal={setModal} setDocViewer={setDocViewer} setOpenMarkModal={setOpenMarkModal} setInstructor={setInstructorId}
                    setChangeStatus={setChangeStatus} />}

            {/* Profile Modal */}
            {modal && (
                <ProfileModal setModal={setModal} modal={modal} setDocViewer={setDocViewer} />
            )}

            {/* Document Viewer Modal */}
            {docViewer && <DocumentViewerModal app={docViewer} onClose={() => setDocViewer(null)} />}

            {/* mark complete Course Modal */}
            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={handleUpdateStatus} isLoading={isInstructorLoading}
                    title={`${changeStatus == 'approved' ? 'Approve' : 'Reject'} instructor`} subTitle={`Are you sure you want to ${changeStatus == 'approved' ? 'approve' : 'reject'} the instructor`} />
            )}
        </div>
    );
}
