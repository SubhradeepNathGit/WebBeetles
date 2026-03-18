import React from 'react'
import { formatDate } from '../../../../util/dateFormat/dateFormat'
import { CheckCircle2, Clock, Shield } from 'lucide-react'

const InstructorAccountStatus = ({ instructorDetails }) => {

    const applicationStatus = instructorDetails?.application_status || "";
    const isVerified = instructorDetails?.is_verified == "fulfilled" ? true : false;
    const isApproved = instructorDetails?.application_status == 'approved';
    const updatedAt = instructorDetails?.updated_at || "";

    return (
        <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 lg:mb-6 flex items-center gap-2">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-green-500/30 flex items-center justify-center border border-green-400/30"><Shield size={18} className="text-green-300" /></div>
                Account Status
            </h2>
            <div className="space-y-3">
                <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm text-purple-200 font-medium">Verification</span>
                        {isVerified ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-green-300 bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30"><CheckCircle2 size={12} /> Verified</span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-orange-300 bg-orange-500/20 px-2 py-1 rounded-full border border-orange-400/30"><Clock size={12} /> Pending</span>
                        )}
                    </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm text-purple-200 font-medium">Application</span>
                        {isApproved ? (
                            <span className="flex items-center gap-1 text-xs font-bold text-green-300 bg-green-500/20 px-2 py-1 rounded-full border border-green-400/30"><CheckCircle2 size={12} /> Approved</span>
                        ) : (
                            <span className="flex items-center gap-1 text-xs font-bold text-blue-300 bg-blue-500/20 px-2 py-1 rounded-full border border-blue-400/30 capitalize"><Clock size={12} /> {applicationStatus || 'Pending'}</span>
                        )}
                    </div>
                </div>
                {updatedAt && (
                    <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm text-purple-200 font-medium">Last Updated</span>
                            <span className="text-xs font-bold text-purple-200">{formatDate(updatedAt)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InstructorAccountStatus