import React from 'react'

const DangerZone = () => {
    return (
        <div className="bg-[#111] p-5 rounded-2xl border border-white/5 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Danger Zone</h3>
            <div className="space-y-2.5">
                <button className="w-full px-4 py-2.5 bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-red-500/20 rounded-xl text-sm font-semibold transition-colors text-left">
                    Clear All Cart Sessions
                </button>
                <button className="w-full px-4 py-2.5 bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-red-500/20 rounded-xl text-sm font-semibold transition-colors text-left">
                    Flush Email Queue
                </button>
                <button className="w-full px-4 py-2.5 bg-red-500/10 hover:bg-red-500/15 text-red-500 border border-red-500/20 rounded-xl text-sm font-semibold transition-colors text-left">
                    Reset Analytics Cache
                </button>
            </div>
        </div>
    )
}

export default DangerZone