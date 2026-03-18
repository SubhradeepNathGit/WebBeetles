import React, { useEffect, useState } from "react";
import InstructorHeader from "../../components/admin/instructor/InstructorHeader";
import SummaryStats from "../../components/admin/instructor/SummaryStats";
import InstructorTable from "../../components/admin/instructor/InstructorTable";
import { allInstructor, updateInstructorBlockUnblockStatus } from "../../redux/slice/instructorSlice";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { allCourse } from "../../redux/slice/couseSlice";
import { useTotalRevenue } from "../../tanstack/query/fetchTotalRevenue";
import getSweetAlert from "../../util/alert/sweetAlert";
import hotToast from "../../util/alert/hot-toast";
import ConfirmStatusModal from "../../components/admin/common/modal/ConfirmStatusModal";


export default function Instructors() {

    const [search, setSearch] = useState("");
    const [openMarkModal, setOpenMarkModal] = useState(false);
    const [instructorId, setInstructorId] = useState(null);
    const [changeStatus, setChangeStatus] = useState(null);

    const dispatch = useDispatch(),
        { isInstructorLoading, getInstructorData, isInstructorError } = useSelector(state => state?.instructor),
        { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course),
        { isLoading: isRevenueLoading, data: revenueData, error: hasRevenueError } = useTotalRevenue();

    const activeCourse = getCourseData?.filter(course => course?.status == 'approved' && course?.is_active && !course?.is_admin_block);

    const noPendingData = getInstructorData?.filter(ins => ins?.application_status != "pending");

    const filtered = noPendingData?.filter(i => i?.name?.toLowerCase()?.includes(search?.toLowerCase()) || i?.email?.toLowerCase()?.includes(search?.toLowerCase()));

    useEffect(() => {
        dispatch(allInstructor())
            .then(res => {
                // console.log('Response for fetching all instructor', res)
            }).catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    useEffect(() => {
        dispatch(allCourse())
            .then(res => {
                // console.error("response from course section", res);
            })
            .catch((err) => {
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
                console.error("Error occurred", err);
            });
    }, [dispatch]);

    const handleMark = () => {
        dispatch(updateInstructorBlockUnblockStatus({ id: instructorId, status: changeStatus }))
            .then(res => {
                // console.log('Response for updating status', res);

                if (res.meta.requestStatus === "fulfilled") {
                    dispatch(allInstructor());
                    hotToast(`Instructor ${changeStatus ? 'blocked' : 'unblocked'} successfully!`, "success");
                    setOpenMarkModal(false);
                }
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Error", `Something went wrong while ${!changeStatus ? 'blocked' : 'unblocked'} the instructor.`, "error");
            })
    }

    // console.log('All available instructors', noPendingData);

    return (
        <>
            <div className="space-y-6">
                <InstructorHeader search={search} setSearch={setSearch} />

                {/* Summary */}
                <SummaryStats isInstructorLoading={isInstructorLoading} getInstructorData={noPendingData} getCourseData={activeCourse}
                    isCourseLoading={isCourseLoading} isRevenueLoading={isRevenueLoading} revenueData={revenueData} />

                {/* Table + Expandable Course Rows */}
                {isInstructorLoading ? <Loader2 className="inline animate-spin my-5 mx-50 w-12 h-12" /> :
                    <InstructorTable filtered={filtered} setOpenMarkModal={setOpenMarkModal} setInstructorId={setInstructorId}
                    setChangeStatus={setChangeStatus} />}
            </div>

            {openMarkModal && (
                <ConfirmStatusModal setOpenMarkModal={setOpenMarkModal} handleMark={handleMark} isLoading={isInstructorLoading}
                    title={`${!changeStatus ? 'Unblock' : 'Block'} instructor`} subTitle={`Are you sure you want to ${!changeStatus ? 'unblock' : 'block'} the instructor`} />
            )}
        </>
    );
}
