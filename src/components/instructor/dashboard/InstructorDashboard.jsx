import React, { useEffect, useState } from "react";
import { BookOpen, Users, BarChart3, Loader2, Plus } from "lucide-react";
import InstructorDashboardHeader from "./dashboardComp/InstructorDashboardHeader";
import InstructorDashboardStats from "./dashboardComp/InstructorDashboardStats";
import InstructorExpertise from "./dashboardComp/InstructorExpertise";
import InstructorSocialLinks from "./dashboardComp/InstructorSocialLinks";
import InstructorMyCourse from "./dashboardComp/course/InstructorMyCourse";

import InstructorQuickLinks from "./dashboardComp/InstructorQuickLinks";
import InstructorThisMonthsStats from "./dashboardComp/InstructorThisMonthsStats";
import InstructorAccountStatus from "./dashboardComp/InstructorAccountStatus";
import { useDispatch, useSelector } from "react-redux";
import { allCourse } from '../../../redux/slice/couseSlice';
import getSweetAlert from "../../../util/alert/sweetAlert";
import { getInstructorStudentCount } from "../../../function/getStudentCountBasedOnSpecificInstructor";
import DashboardSkeleton from "../../../layout/common/DashboardSkeleton";

const InstructorDashboard = ({ instructorDetails }) => {

  const dispatch = useDispatch(),
    [studentCount, setStudentCount] = useState(0),
    { isCourseLoading, getCourseData } = useSelector(state => state.course);

  useEffect(() => {
    if (!instructorDetails?.id) return;

    dispatch(allCourse({ instructor_id: instructorDetails?.id }))
      .catch(() => {
        getSweetAlert("Error", "Something went wrong.", "error");
      })
  }, [dispatch, instructorDetails?.id]);

  useEffect(() => {
    const loadStudentCount = async () => {
      const count = await getInstructorStudentCount(instructorDetails?.id);
      setStudentCount(count);
    };

    loadStudentCount();
  }, [instructorDetails?.id]);

  const stats = [
    { icon: BookOpen, value: getCourseData?.length ?? 0, label: "Total Courses", color: "rose" },
    { icon: Users, value: studentCount?.toLocaleString(), label: "Total Students", color: "blue" }
  ];

  const quickActions = [
    { label: "Create New Course", icon: Plus, gradient: "from-rose-500/30 to-rose-600/30", func: () => window.dispatchEvent(new CustomEvent("open-add-course")) },
    { label: "View All Students", icon: Users, gradient: "from-blue-500/30 to-blue-600/30", func: () => console.log('All Students Clicked!') },
    { label: "Course Analytics", icon: BarChart3, gradient: "from-pink-500/30 to-pink-600/30", func: () => window.dispatchEvent(new CustomEvent("open-instructor-analytics")) }
  ];

  if (isCourseLoading || !instructorDetails || Object.keys(instructorDetails).length === 0) {
    return <DashboardSkeleton role="instructor" />;
  }

  return (
    <div className="bg-black overflow-x-hidden">
      <div className="max-w-full mx-auto space-y-6">

        {/* HEADER */}
        <InstructorDashboardHeader instructorDetails={instructorDetails} />

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
          {stats.map((s, i) => (
            <InstructorDashboardStats key={i} s={s} />
          ))}
        </div>

        {/* EXPERTISE & SOCIAL */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">

          {/* EXPERTISE */}
          <InstructorExpertise instructorDetails={instructorDetails} />

          {/* SOCIAL LINKS */}
          <InstructorSocialLinks instructorDetails={instructorDetails} />

        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

          {/* LEFT COL */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5 lg:space-y-6">

            {/* COURSES */}
            <InstructorMyCourse courses={getCourseData} />


          </div>

          {/* RIGHT COL */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">

            {/* MONTHLY */}
            <InstructorThisMonthsStats instructorDetails={instructorDetails} />

            {/* QUICK ACTIONS */}
            <InstructorQuickLinks quickActions={quickActions} />

            {/* ACCOUNT STATUS */}
            <InstructorAccountStatus instructorDetails={instructorDetails} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
