import React from 'react'
import { Star } from 'lucide-react'
import { useCoursePurchases } from '../../../tanstack/query/fetchCoursePurchase';
import CourseRating from '../../student/dashboard/student-myCourse/rating-review/CourseRating';

const TopCourseRow = ({course,revenue}) => {

        const { data: students, isLoading: isStudentLoading } = useCoursePurchases(course?.id);
    
    return (
        <tr className="hover:bg-white/[0.02] transition-colors group text-center">
            <td className="px-5 py-3 text-left">
                <p className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors truncate max-w-[180px]">{course?.title??'N/A'}</p>
                <p className="text-xs text-gray-500">{course?.instructor?.name??'N/A'}</p>
            </td>
            <td className="px-5 py-3 text-sm text-gray-300 font-medium">{students?.length?.toLocaleString()??'0'}</td>
            <td className="px-5 py-3 text-sm text-yellow-500 font-semibold">{revenue?.toLocaleString()??'0'}</td>
            <td className="px-5 py-3">
                <span className="flex items-center gap-1 text-sm text-gray-300">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" /> <CourseRating courseId={course?.id} />
                </span>
            </td>
        </tr>
    )
}

export default TopCourseRow