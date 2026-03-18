import React from 'react'
import SectionHeader from './common/sectionHeader'

const TopCategory = () => {
    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-xl">
            <SectionHeader title="Top Course Categories" />
            <div className="space-y-4">
                {[
                    { label: "Web Development", pct: 38, color: "bg-purple-500" },
                    { label: "Data Science", pct: 27, color: "bg-yellow-500" },
                    { label: "Design (UI/UX)", pct: 18, color: "bg-fuchsia-500" },
                    { label: "Marketing", pct: 10, color: "bg-blue-500" },
                    { label: "Others", pct: 7, color: "bg-gray-600" },
                ].map((cat, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">{cat.label}</span>
                            <span className="text-white font-semibold">{cat.pct}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                            <div className={`${cat.color} h-2 rounded-full transition-all`} style={{ width: `${cat.pct}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TopCategory