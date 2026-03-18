import React from 'react'

const SystemStatus = () => {
    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">System Status</h3>
            <div className="space-y-3">
                {[
                    { label: "Payment Gateway (Razorpay)", status: "Operational" },
                    { label: "Email Service", status: "Operational" },
                    { label: "Database (PostgreSQL)", status: "Optimized" },
                    { label: "CDN (Course Videos)", status: "Operational" },
                    { label: "Auth Service", status: "Operational" },
                ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-xs text-gray-500">{s.label}</span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-yellow-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> {s.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SystemStatus