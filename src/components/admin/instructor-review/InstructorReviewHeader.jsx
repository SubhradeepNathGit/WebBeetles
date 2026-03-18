import React from 'react'
import { Search } from 'lucide-react'

const InstructorReviewHeader = ({ search, setSearch }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white">New Instructor Applications</h1>
                <p className="text-gray-500 mt-1 text-sm">
                    Review credentials and approve or reject applicants before they can access the instructor portal.
                </p>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search applicants..."
                    className="pl-9 pr-4 py-2 bg-[#1a1a1a] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64"
                />
            </div>
        </div>
    )
}

export default InstructorReviewHeader