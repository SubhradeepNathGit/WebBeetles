import React from 'react'

const PlatformSummary = ({ maintenanceMode, promoCodes, cartEnabled, tax }) => {
    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Platform Summary</h3>
            <div className="space-y-3">
                {[
                    { label: "Platform Version", value: "v2.4.1" },
                    { label: "Current TAX Rate", value: `${tax?.filter(tax=>tax?.status)?.reduce((acc,cur)=>acc+Number(cur?.percentage),0)}%` },
                    { label: "Cart Status", value: cartEnabled ? "Enabled" : "Disabled" },
                    { label: "Active Promo Codes", value: promoCodes.filter(p => p?.status)?.length },
                    { label: "Maintenance Mode", value: maintenanceMode ? "🔴 ON" : "🟡 OFF" },
                ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs text-gray-500">{s.label}</span>
                        <span className="text-xs font-semibold text-white">{s.value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PlatformSummary