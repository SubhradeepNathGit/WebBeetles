import React, { useState } from 'react'
import { Mail, BookOpen, ChevronDown, Loader2 } from "lucide-react";
import { formatDateDDMMYYYYHHMM } from '../../../util/dateFormat/dateFormat';
import { useInstructorCourses } from '../../../tanstack/query/fetchInstructorCourses';
import { useInstructorStats } from '../../../tanstack/query/fetchInstructorStats';
import CourseRow from './CourseRow';

const TableRow = ({ inst,setOpenMarkModal, setInstructorId, setChangeStatus }) => {

    const [expanded, setExpanded] = useState(null);

    const { isLoading: isCourseLoading, data: courseData, error: courseError } = useInstructorCourses(inst?.id);
    const { isLoading: isStatsLoading, data: statusData, error: statsError } = useInstructorStats(inst?.id);

    const STATUS_COLORS = {
        Active: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-4",
        Suspended: "bg-red-500/10 text-red-500 border-red-500/20",
        NA: "bg-purple-500/10 text-purple-500 border-purple-500/20 px-6.5",
    };

    const APPROVAL_STATUS_COLORS = {
        approved: "bg-green-500/10 text-green-500 border-green-500/20",
        rejected: "bg-red-500/10 text-red-500 border-red-500/20 px-3.5",
    };

    // console.log(getInstructorData);

    return (
        <>
            <tr className="hover:bg-white/[0.02] transition-colors group text-center">
                <td className="pl-6 py-4">
                    <ChevronDown size={16} className={`text-gray-600 transition-transform duration-200 ${inst?.application_status === "approved"?'cursor-pointer':'cursor-not-allowed'} ${expanded === inst?.id ? "rotate-180" : ""}`} onClick={() => { if (inst?.application_status === "approved") { setExpanded(expanded === inst?.id ? null : inst?.id) } }} />
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white font-bold text-sm border border-white/10 flex-shrink-0">
                            {inst?.profile_image_url ? <img className='rounded-full' src={inst?.profile_image_url} alt={inst?.name?.charAt(0)} /> : inst?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors text-left">{inst?.name ?? 'N/A'}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 text-left"><Mail size={11} />{inst?.email ?? 'N/A'}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 font-medium">
                    <div className="flex items-center gap-1.5"><BookOpen size={13} className="text-purple-400" />{inst?.application_status === "approved" ? (isCourseLoading ? <Loader2 className='w-4 h-4 inline animate-spin' /> : courseData?.length ?? 'N/A') : '0'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 font-medium">{inst?.application_status === "approved" ? (isStatsLoading ? <Loader2 className='w-4 h-4 inline animate-spin' /> : statusData?.totalStudents ?? 'N/A') : '0'}</td>
                <td className="px-6 py-4 text-sm text-yellow-500 font-semibold">{"₹" + (inst?.application_status === "approved" ? (isStatsLoading ? <Loader2 className='w-4 h-4 inline animate-spin' /> : statusData?.totalRevenue?.toLocaleString() ?? 'N/A') : '0')}</td>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                        {inst?.application_status === "approved" ? formatDateDDMMYYYYHHMM(inst?.last_login) : 'N/A'}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${APPROVAL_STATUS_COLORS[inst?.application_status]}`}>{inst?.application_status?.charAt(0)?.toUpperCase() + inst?.application_status?.slice(1)?.toLowerCase()}</span>
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[inst?.application_status === "approved" ? inst?.is_blocked ? 'Suspended' : 'Active' : 'NA']}`}>{inst?.application_status === "approved" ? inst?.is_blocked ? 'Suspended' : 'Active' : 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                    <button className={`py-1 rounded-xl ${inst?.application_status === "approved" ? inst?.is_blocked ? 'px-4 bg-green-500/10 text-green-500 border-green-500/20 hover:text-green-200 hover:bg-green-500/40 hover:border-green-500/50 cursor-pointer' :
                        'px-5 bg-red-500/10 text-red-500 border-red-500/20 hover:text-red-200 hover:bg-red-500/40 hover:border-red-500/50 cursor-pointer' : 'px-2 bg-gray-500/10 text-gray-500 border-gray-500/20 cursor-not-allowed'}`} onClick={() => { setOpenMarkModal(true); setInstructorId(inst?.id); setChangeStatus(!inst?.is_blocked); }}>
                        {inst?.application_status === "approved" ? !inst?.is_blocked ? 'Block' : 'Active' : 'Disabled'}</button>
                </td>
            </tr>
            {expanded === inst?.id && (
                <tr className="bg-[#0d0d0d]">
                    <td colSpan={12} className="px-8 py-4 text-sm">
                        <div className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Published Courses by {inst?.name}</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {courseData?.slice(0, 3)?.map((course, i) => (
                                <CourseRow key={i} course={course} i={i} />
                            ))}
                            {courseData?.length > 3 && (
                                <div className="bg-[#161616] rounded-xl p-3 border border-white/5 flex items-center justify-center text-xs text-purple-400 hover:text-yellow-400 transition-colors cursor-pointer">
                                    +{courseData?.length - 3} more course{courseData?.length - 3 > 1 ? 's' : ''}
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

export default TableRow