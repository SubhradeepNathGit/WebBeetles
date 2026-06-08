import { Loader2 } from 'lucide-react'
import React from 'react'

const SummaryStats = ({ isInstructorLoading, getInstructorData, isCourseLoading, getCourseData, isRevenueLoading, revenueData }) => {

    const activeInstructor = getInstructorData?.filter(ins => !ins?.is_blocked && ins?.application_status == "approved");
    const totalRevenue = revenueData?.reduce((acc, cur) => acc + Number(cur?.amount), 0);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
                { label: "Total Instructors", value: isInstructorLoading ? <span className="inline-block h-5 w-12 bg-white/5 rounded animate-pulse"></span> : getInstructorData?.length ?? 0 },
                { label: "Active Instructors", value: isInstructorLoading ? <span className="inline-block h-5 w-12 bg-white/5 rounded animate-pulse"></span> : activeInstructor?.length ?? 0 },
                { label: "Total Courses Published", value: isCourseLoading ? <span className="inline-block h-5 w-12 bg-white/5 rounded animate-pulse"></span> : getCourseData?.length ?? 0 },
                { label: "Revenue Attributed (Fee & TAX)", value: isRevenueLoading ? <span className="inline-block h-5 w-20 bg-white/5 rounded animate-pulse"></span> : "₹" + (totalRevenue?.toLocaleString() ?? 0) }
            ].map((s, i) => (
                <div key={i} className="bg-[#111] p-4 rounded-xl border border-white/5 shadow-xl">
                    <div className="text-xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
            ))}
        </div>
    )
}

export default SummaryStats