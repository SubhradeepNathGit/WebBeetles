import { Filter, Search } from 'lucide-react'
import React from 'react'

const UserHeader = ({ search, setSearch }) => {

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-gray-500 mt-1 text-sm">View, manage, and control all registered students on the platform.</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white rounded-xl text-sm font-medium border border-white/5 transition-all">
                    <Filter size={15} /> Filter
                </button>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="pl-9 pr-4 py-2 bg-[#1a1a1a] border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64 transition-all"
                    />
                </div>
            </div>
        </div>
    )
}

export default UserHeader