import React, { useEffect } from 'react'
import { Users, BookOpen, ShoppingCart, TrendingUp, ClipboardCheck, BookOpenCheck, Loader2, IndianRupee, UserStar, Blinds } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStudents } from '../../../redux/slice/allStudentSlice';
import { allCourse } from '../../../redux/slice/couseSlice';
import { allInstructor } from '../../../redux/slice/instructorSlice';
import { useTotalRevenue } from '../../../tanstack/query/fetchTotalRevenue';
import { fetchAllCart } from '../../../redux/slice/cartSlice';

const StatCardHeader = () => {

  const dispatch = useDispatch(),
    { isAllStudentLoading, getAllStudentData, isAllStudentError } = useSelector(state => state.allStudent),
    { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state?.course),
    { isInstructorLoading, getInstructorData, isInstructorError } = useSelector(state => state?.instructor),
    { isCartLoading, cartItems, hasCartError } = useSelector(state => state?.cart),
    { isLoading: isRevenueLoading, data: revenueData, error: hasRevenueError } = useTotalRevenue();

  useEffect(() => {
    dispatch(fetchAllStudents());
    dispatch(allCourse());
    dispatch(allInstructor());
    dispatch(fetchAllCart());
  }, [dispatch]);

  const activeCourse = getCourseData?.filter(c => c?.status == 'approved' && !c?.is_completed);
  const examScheduledCourse = getCourseData?.filter(c => c?.status == 'approved' && c?.is_completed && c?.is_exam_scheduled);
    const pendingCourse = getCourseData?.filter(c => c?.status == 'pending');
  const approvedInstructor = getInstructorData?.filter(inst => inst?.application_status == 'approved');
  const pendingApplication = getInstructorData?.filter(ins => ins?.application_status == "pending");
  const totalRevenue = revenueData?.reduce((acc, cur) => acc + Number(cur?.amount), 0);

  function StatCard({ icon: Icon, label, value, sub, trend, trendUp = true, iconColor = "text-purple-400" }) {
    return (
      <div className="bg-[#111] p-5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all duration-200 shadow-xl group">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl bg-[#1a1a1a] border border-white/5 ${iconColor}`}>
            <Icon size={20} />
          </div>
          {trend && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trendUp ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"}`}>
              {trend}
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
        {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard icon={Users} label="Total Students" value={(isAllStudentLoading ? <Loader2 className='inline animate-spin w-5 h-5' /> : getAllStudentData?.length) ?? 0} trend="+15.5%" sub="Registered users" />
      <StatCard icon={BookOpenCheck} label="Active Courses" value={(isCourseLoading ? <Loader2 className='inline animate-spin w-5 h-5' /> : activeCourse?.length) ?? 0} trend="+5.3%" sub="Published & live" />
      <StatCard icon={UserStar} label="Total Instructors" value={(isInstructorLoading ? <Loader2 className='inline animate-spin w-5 h-5' /> : approvedInstructor?.length) ?? 0} trend="+2.2%" iconColor="text-yellow-400" sub="Approved experts" />
      <StatCard icon={IndianRupee} label="Total Revenue" value={(isRevenueLoading ? <Loader2 className='inline animate-spin w-5 h-5' /> : totalRevenue?.toLocaleString()) ?? 0} trend="+18.4%" sub="This financial year (without tax)" />
      <StatCard icon={ShoppingCart} label="Active Cart Sessions" value={(isCartLoading ? <Loader2 className='inline animate-spin w-5 h-5' /> : cartItems?.length) ?? 0} trend="-3.1%" trendUp={false} iconColor="text-yellow-400" sub="Pending checkout" />
      <StatCard icon={Blinds} label="Exam Scheduled" value={(isCourseLoading ? <Loader2 className='inline animate-spin w-5 h-5' /> : examScheduledCourse?.length) ?? 0} trend="+4.1%" sub="Across all courses" />
      <StatCard icon={ClipboardCheck} label="Pending Reviews" value={(isInstructorLoading ? <Loader2 className='inline animate-spin w-5 h-5' /> : pendingApplication?.length) ?? 0} trend="New" sub="Instructor applications" iconColor="text-yellow-400" />
      <StatCard icon={BookOpen} label="Courses to Approve" value={(isCourseLoading ? <Loader2 className='inline animate-spin w-5 h-5' /> : pendingCourse?.length) ?? 0} trend="Pending" sub="Awaiting admin review" />
    </div>
  )
}

export default StatCardHeader