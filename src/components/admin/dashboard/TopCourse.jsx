import React, { useEffect, useMemo } from 'react'
import { ChevronRight, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import TopCourseRow from './TopCourseRow'
import { useDispatch, useSelector } from 'react-redux'
import { allCourse } from '../../../redux/slice/couseSlice'
import { useAllCoursesRevenue } from '../../../tanstack/query/fetchAllCourseRevenue'

const TopCourse = ({ TOP_COURSES }) => {

    const dispatch = useDispatch(),
        { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course);

    useEffect(() => {
        dispatch(allCourse())
            .then(res => {
                // console.log('Response for fetching courses', res);
            })
            .catch(err => {
                console.log('Error occured', err);
            })
    }, [dispatch]);

    const approved = getCourseData?.filter(c => c?.status == 'approved') || [];

    const courseIds = approved.map(c => c.id)
    const { data: revenueMap = {}, isLoading: revenueLoading } = useAllCoursesRevenue(courseIds);

    const sortedCourses = useMemo(() => {
        return [...approved].sort(
            (b, a) => (revenueMap[a.id] || 0) - (revenueMap[b.id] || 0)
        )
    }, [approved, revenueMap])

    return (
        <div className="bg-[#111] rounded-2xl border border-white/5 shadow-xl lg:col-span-3 overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-white/5">
                <h2 className="text-base font-semibold text-white">Top Performing Courses</h2>
                <Link to="/admin/approve-courses" className="text-xs text-purple-400 hover:text-yellow-400 flex items-center gap-1 transition-colors">
                    Manage <ChevronRight size={14} />
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/5 text-center">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Course</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Students</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                            <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isCourseLoading || revenueLoading ? (
                            <tr>
                                <td colSpan={4} className="py-6 text-center">
                                    <Loader2 className="inline w-6 h-6 animate-spin" />
                                </td>
                            </tr>
                        ) : sortedCourses?.length > 0 ? (
                            sortedCourses?.map(course => (
                                <TopCourseRow key={course.id} course={course} revenue={revenueMap[course.id] || 0} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={12} className="py-6 text-center text-gray-400">
                                    No course available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TopCourse