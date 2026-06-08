import { Loader2 } from 'lucide-react'
import React from 'react'

const ApproveCourseStats = ({ rejected, approved, pending, isCourseLoading }) => {
    return (
        <div className="flex gap-4 flex-wrap">
            <div className="bg-[#111] px-5 py-3 rounded-xl border border-white/5 text-sm font-medium text-white">Pending <span className="text-yellow-400 ml-2">{isCourseLoading ? <span className="inline-block h-4 w-6 bg-white/5 rounded animate-pulse"></span> : pending?.length ?? 0}</span></div>
            <div className="bg-[#111] px-5 py-3 rounded-xl border border-white/5 text-sm font-medium text-white">Approved <span className="text-green-500 ml-2">{isCourseLoading ? <span className="inline-block h-4 w-6 bg-white/5 rounded animate-pulse"></span> : approved?.length ?? 0}</span></div>
            <div className="bg-[#111] px-5 py-3 rounded-xl border border-white/5 text-sm font-medium text-white">Rejected <span className="text-red-500 ml-2">{isCourseLoading ? <span className="inline-block h-4 w-6 bg-white/5 rounded animate-pulse"></span> : rejected?.length ?? 0}</span></div>
        </div>
    )
}

export default ApproveCourseStats