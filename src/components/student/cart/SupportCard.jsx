import React from 'react'
import { Headphones, MessageCircle } from 'lucide-react'

const SupportCard = ({ setShowSupportModal }) => {
    return (
        <div className="bg-[#111] rounded-xl p-5 border border-white/10">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Headphones className="w-5 h-5 text-purple-400" />
                Need Help?
            </h3>
            <p className="text-xs text-white/50 mb-4">
                Our experts are here to assist you
            </p>
            <div className="space-y-2">
                <button
                    onClick={() => setShowSupportModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all text-sm font-semibold cursor-pointer"
                >
                    <MessageCircle className="w-4 h-4" />
                    View Contact Options
                </button>
            </div>
        </div>
    )
}

export default SupportCard