import React from 'react'
import { useTotalRevenue } from '../../../tanstack/query/fetchTotalRevenue'

const SummaryStats = ({ getAllStudentData }) => {

    const { isLoading, data } = useTotalRevenue();
    const totalRevenue = data?.reduce((acc, cur) => acc + cur?.amount, 0)?.toLocaleString();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
                { label: "Total Students", value: getAllStudentData?.length ?? 0 },
                { label: "Active Users", value: getAllStudentData?.filter(student => !student?.is_blocked)?.length ?? 0 },
                { label: "Inactive / Churned", value: getAllStudentData?.filter(student => student?.is_blocked)?.length ?? 0 },
                { label: "Total Revenue", value: "₹ " + (totalRevenue ?? 0) },
            ]?.map((s, i) => (
                <div key={i} className="bg-[#111] p-4 rounded-xl border border-white/5 shadow-xl">
                    <div className="text-xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
            ))}
        </div>
    )
}

export default SummaryStats