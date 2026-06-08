import React, { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import TableSkeleton from "../../components/admin/common/TableSkeleton";
import UserHeader from "../../components/admin/student/UserHeader";
import SummaryStats from "../../components/admin/student/SummaryStats";
import UserTable from "../../components/admin/student/UserTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStudents } from "../../redux/slice/allStudentSlice";

export default function Students() {

    const dispatch = useDispatch(),
        { isAllStudentLoading, getAllStudentData, isAllStudentError } = useSelector(state => state.allStudent);

    useEffect(() => {
        dispatch(fetchAllStudents())
            .then(res => {
                // console.log('Response for fetching all students', res);
            })
            .catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    const [search, setSearch] = useState("");
    const filtered = getAllStudentData?.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    // console.log('All available students', getAllStudentData);

    return (
        <div className="space-y-6">
            {/* Header */}
            <UserHeader search={search} setSearch={setSearch} />

            {/* Summary stats */}
            <SummaryStats getAllStudentData={getAllStudentData} />

            {/* Table */}
            {isAllStudentLoading ? <TableSkeleton columns={8} rows={5} /> :
                <UserTable filtered={filtered} allStudentData={getAllStudentData} />}

        </div>
    );
}
