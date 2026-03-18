import React from 'react'
import { Loader2 } from 'lucide-react';

const StatsCounter = ({ isInstructorLoading, getInstructorData }) => {

    return (
        <div className="flex gap-4 flex-wrap">
            <div className="bg-[#111] px-5 py-3 rounded-xl border border-white/5 text-sm font-medium text-white">
                Pending <span className="text-yellow-400 ml-2">{isInstructorLoading ? <Loader2 className='w-4 h-4 inline animate-spin' /> : getInstructorData?.filter(inst => inst?.application_status == 'pending' && inst?.application_complete)?.length ?? 0}</span>
            </div>
            <div className="bg-[#111] px-5 py-3 rounded-xl border border-white/5 text-sm font-medium text-white">
                Approved <span className="text-green-500 ml-2">{isInstructorLoading ? <Loader2 className='w-4 h-4 inline animate-spin' /> : getInstructorData?.filter(inst => inst?.application_status == 'approved')?.length ?? 0}</span>
            </div>
            <div className="bg-[#111] px-5 py-3 rounded-xl border border-white/5 text-sm font-medium text-white">
                Rejected <span className="text-red-500 ml-2">{isInstructorLoading ? <Loader2 className='w-4 h-4 inline animate-spin' /> : getInstructorData?.filter(inst => inst?.application_status == 'rejected')?.length ?? 0}</span>
            </div>
        </div>
    )
}

export default StatsCounter