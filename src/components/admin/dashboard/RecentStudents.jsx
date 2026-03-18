import React, { useEffect } from 'react'
import SectionHeader from './common/sectionHeader'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllStudents } from '../../../redux/slice/allStudentSlice';
import { formatDateByHHAndDay } from '../../../util/timeFormat/timeFormat';
import { Loader2 } from 'lucide-react';

const RecentStudents = () => {

    const dispatch = useDispatch(),
        { isAllStudentLoading, getAllStudentData, isAllStudentError } = useSelector(state => state.allStudent);

    useEffect(() => {
        dispatch(fetchAllStudents());
    }, [dispatch]);

    return (
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl">
            <SectionHeader title="Recent Signups" linkTo="/admin/students" />
            <div className="space-y-3">
                {isAllStudentLoading ? <Loader2 className='inline mx-auto animate-spin w-10 h-10' /> : getAllStudentData?.length > 0 ?
                    getAllStudentData?.slice(0, 4)?.map(s => (
                        <div key={s?.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                {s?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{s?.name ?? 'N/A'}</p>
                                <p className="text-xs text-gray-500 truncate">{s?.email ?? 'N/A'}</p>
                            </div>
                            <span className="text-xs text-gray-600 flex-shrink-0">{formatDateByHHAndDay(s?.created_at)}</span>
                        </div>
                    )) : <p className='text-center'>No Students available</p>}
            </div>
        </div>
    )
}

export default RecentStudents