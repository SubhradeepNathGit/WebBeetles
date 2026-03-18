import React from 'react'
import { Check, IndianRupee, Star, Users } from 'lucide-react'
import { useCourseStudents } from '../../../../tanstack/query/fetchCourseStudents';
import CourseRating from '../../../student/dashboard/student-myCourse/rating-review/CourseRating';

const LiveCourseRow = ({ c, setOpenBlockUnblockModal, setBlockUnblockCourseId, setBlockUnblockChangeStatus }) => {

    const { isLoading: isStudentDataLoading, data: studentData, error: hasStudentDataError } = useCourseStudents(c?.id);
    const currentStatus = (!c?.is_admin_block && !c?.is_active) ? true : false;

    return (
        <div className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0"><Check size={16} /></div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors truncate relative">{(c?.title?.length > 28 ? c?.title?.slice(0, 28) + '...' : c?.title) ?? 'N/A'}
                    <span className={`absolute text-[9px] ml-1 ${currentStatus ? 'text-green-500' : 'text-red-500'}`}>{currentStatus ? 'Active' : 'Block'}</span>
                </p>
                <p className="text-xs text-gray-500">{c?.instructor?.name ?? 'N/A'} · <IndianRupee className='inline w-2.5 h-2.5 mb-0.5 text-blue-300' />{c?.price ?? 0} · <Users className='inline w-2.5 h-2.5 mb-0.5 mr-0.5 text-red-300' />{studentData?.length} · <Star className='inline w-2.5 h-2.5 mb-1 mr-0.5 text-yellow-400' /><CourseRating courseId={c?.id} /></p>
            </div>
            {c?.is_exam_scheduled && <span className="text-xs border bg-orange-500/10 text-orange-400 border-orange-500/20 px-2.5 py-1 rounded-md hidden sm:block">Exam Scheduled</span>}
            {c?.is_completed && <span className="text-xs border bg-purple-500/10 text-purple-400 border-purple-500/20 px-2.5 py-1 rounded-md hidden sm:block">Complete</span>}
            <span className={`text-xs border ${c?.is_admin_block ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'} px-2.5 py-1 rounded-md hidden sm:block`}>{c?.is_admin_block ? 'Block' : 'Active'}</span>
            {/* <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-md hidden sm:block">{c.cat}</span>
            {c.students && <span className="text-sm text-gray-400 hidden md:block">{c.students.toLocaleString()} students</span>}
            {c.revenue && <span className="text-sm text-yellow-500 font-semibold hidden md:block">{c.revenue}</span>} */}
            <span className="text-sm font-semibold hidden md:block">
                <button className='mx-2 text-xs uppercase px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-300/10 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:border-blue-400/20 cursor-pointer'>View</button>
                <button className={`text-xs uppercase px-3.5 py-1.5 rounded-xl border ${!c?.is_admin_block ? 'bg-red-500/10 hover:bg-red-300/10 text-red-400 hover:text-red-300 border-red-500/20 hover:border-red-400/20' :
                    'bg-green-500/10 hover:bg-green-300/10 text-green-400 hover:text-green-300 border-green-500/20 hover:border-green-400/20'} cursor-pointer`}
                    onClick={() => { setOpenBlockUnblockModal(true); setBlockUnblockCourseId(c?.id); setBlockUnblockChangeStatus(c?.is_admin_block?'unblock':'block') }}>{!c?.is_admin_block ? 'Block' : 'Active'}</button>
            </span>
        </div>
    )
}

export default LiveCourseRow