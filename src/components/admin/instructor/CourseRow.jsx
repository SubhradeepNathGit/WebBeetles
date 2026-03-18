import React from 'react'
import { BookOpen, Loader2, Star } from 'lucide-react'
import { useCourseStudents } from '../../../tanstack/query/fetchCourseStudents'
import CourseRating from '../../student/dashboard/student-myCourse/rating-review/CourseRating';

const CourseRow = ({ course, i }) => {

    const { isLoading: isStudentDataLoading, data: studentData, error: hasStudentDataError } = useCourseStudents(course?.id);

    return (
        <div className="bg-[#161616] rounded-xl p-3 border border-white/5 hover:border-purple-500/20 transition-colors">
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="text-sm font-semibold text-white mb-1">{(course?.title?.length > 25 ? course?.title?.slice(0, 25) + '...' : course?.title) ?? 'N/A'}</span>
                <span className="text-yellow-500 font-semibold"><Star className='inline w-3 h-3 mr-1 mb-1' /><CourseRating courseId={course?.id} /></span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><BookOpen size={11} /> {isStudentDataLoading ? <Loader2 className='inline w-4 h-4 animate-spin' /> : studentData?.length ?? "—"} student{studentData?.length > 1 ? 's' : ''}</span>
                <span className="text-orange-500 font-semibold">{"₹" + course?.price?.toLocaleString() ?? '-'}</span>
            </div>
        </div>
    )
}

export default CourseRow