import React, { useEffect } from 'react'
import { Bell, BookOpenCheck, ChevronRight, ClipboardCheck, FileText, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionHeader from './common/sectionHeader'
import { useDispatch, useSelector } from 'react-redux'
import { allCourse } from '../../../redux/slice/couseSlice'
import { allInstructor } from '../../../redux/slice/instructorSlice'

const QuickActions = () => {

    const dispatch = useDispatch(),
        { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course),
        { isInstructorLoading, getInstructorData, isInstructorError } = useSelector(state => state?.instructor);

    useEffect(() => {
        dispatch(allCourse());
        dispatch(allInstructor());
    }, [dispatch]);

    const pendingCourse = getCourseData?.filter(c => c?.status == 'pending');
    const pendingRequest = getInstructorData?.filter(inst => inst?.application_status == 'pending' && inst?.application_complete);

    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-xl">
            <SectionHeader title="Quick Actions" />
            <div className="space-y-2.5">
                {[
                    { label: "Review Instructor Applications", to: "/admin/instructor-reviews", badge: `${pendingCourse?.length ?? 0} Pending `, icon: <ClipboardCheck size={16} /> },
                    { label: "Approve New Courses", to: "/admin/approve-courses", badge: `${pendingRequest?.length ?? 0} Pending `, icon: <BookOpenCheck size={16} /> },
                    { label: "Manage All Students", to: "/admin/students", badge: null, icon: <Users size={16} /> },
                    { label: "View Platform Analytics", to: "/admin/analytics", badge: null, icon: <TrendingUp size={16} /> },
                    { label: "Update Promo Codes", to: "/admin/charge", badge: null, icon: <FileText size={16} /> },
                    { label: "Update GST & Tax Rules", to: "/admin/charge", badge: null, icon: <Bell size={16} /> },
                ].map((action, i) => (
                    <Link key={i} to={action.to} className="flex items-center justify-between w-full px-4 py-2.5 bg-[#161616] hover:bg-[#1e1e1e] rounded-xl transition-all group border border-transparent hover:border-purple-500/20">
                        <div className="flex items-center gap-2.5 text-gray-400 group-hover:text-white transition-colors">
                            <span className="text-purple-400 group-hover:text-yellow-400 transition-colors">{action.icon}</span>
                            <span className="text-sm font-medium">{action.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {action.badge && <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-md border border-yellow-500/20 font-medium">{action.badge}</span>}
                            <ChevronRight size={14} className="text-gray-600 group-hover:text-purple-400 transition-colors" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default QuickActions