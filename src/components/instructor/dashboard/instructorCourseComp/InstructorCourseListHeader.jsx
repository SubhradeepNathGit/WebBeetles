import React from 'react'
import { Plus } from 'lucide-react'

const InstructorCourseListHeader = () => {
    return (
        <>
            <div>
                <h1 className="text-4xl font-bold mb-2">My Courses</h1>
                <p className="text-gray-400">Manage your courses and track performance</p>
            </div>
            <button onClick={() => window.dispatchEvent(new CustomEvent("open-add-course"))} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all flex items-center gap-2 cursor-pointer">
                <Plus className="w-5 h-5" />
                Create New Course
            </button>
        </>
    )
}

export default InstructorCourseListHeader