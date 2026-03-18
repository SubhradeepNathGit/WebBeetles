import React from 'react'
import { BookOpen, User, Clock, Check, X, Eye } from "lucide-react";
import { formatDateDDMMYY } from '../../../util/dateFormat/dateFormat';
import { useCourseVideos } from '../../../tanstack/query/fetchLectureVideo';
import { formatToHHMMSS } from '../../../util/timeFormat/timeFormat';

const PendingTableRow = ({ course, setPreview, setCourseId, setChangeStatus, setOpenMarkModal }) => {

    const { isLoading, data: lectureData, error } = useCourseVideos({ courseId: course?.id });
    const totalSeconds = lectureData?.reduce((acc, value) => acc + Number(value?.duration || 0), 0) || 0;
    const totalLectureTiming = formatToHHMMSS(totalSeconds);

    return (
        <tr className="hover:bg-white/[0.02] transition-colors group text-center">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                        <BookOpen size={18} />
                    </div>
                    <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors max-w-[200px] text-left">{(course?.title?.length > 50 ? course?.title?.slice(0, 50) + '...' : course?.title) ?? 'N/A'}</p>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-1.5"><User size={13} className="text-purple-400" />{course?.instructor?.name ?? 'N/A'}</div>
            </td>
            <td className="px-6 py-4">
                <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-md font-medium">{course?.category?.name ?? 'N/A'}</span>
            </td>
            <td className="px-6 py-4 text-xs text-gray-500">
                <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1"><Clock size={11} />{totalLectureTiming}</span>
                    <span className="flex items-center gap-1"><BookOpen size={11} />{lectureData?.length} module{lectureData?.length > 1 ? 's' : ''}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-yellow-500 font-semibold">{"₹" + course?.price ?? '0'}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{formatDateDDMMYY(course?.created_at)}</td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button onClick={() => setPreview(course)} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg transition-colors text-xs font-semibold cursor-pointer">
                        <Eye size={13} /> Preview
                    </button>
                    <button onClick={() => {setOpenMarkModal(true); setChangeStatus("approved"); setCourseId(course?.id)}} className="p-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20 rounded-lg transition-colors cursor-pointer"><Check size={15} /></button>
                    <button onClick={() => {setOpenMarkModal(true); setChangeStatus("rejected"); setCourseId(course?.id)}} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors cursor-pointer"><X size={15} /></button>
                </div>
            </td>
        </tr>
    )
}

export default PendingTableRow