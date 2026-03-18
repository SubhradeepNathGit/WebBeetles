import React, { useEffect, useState } from "react";
import { BookOpen, Users, BarChart3, Loader2, Plus } from "lucide-react";
import InstructorDashboardHeader from "./dashboardComp/InstructorDashboardHeader";
import InstructorDashboardStats from "./dashboardComp/InstructorDashboardStats";
import InstructorExpertise from "./dashboardComp/InstructorExpertise";
import InstructorSocialLinks from "./dashboardComp/InstructorSocialLinks";
import InstructorMyCourse from "./dashboardComp/course/InstructorMyCourse";
import InstructorRecentActivity from "./dashboardComp/InstructorRecentActivity";
import InstructorUpcommingTasks from "./dashboardComp/InstructorUpcommingTasks";
import InstructorQuickLinks from "./dashboardComp/InstructorQuickLinks";
import InstructorThisMonthsStats from "./dashboardComp/InstructorThisMonthsStats";
import InstructorAccountStatus from "./dashboardComp/InstructorAccountStatus";
import { useDispatch, useSelector } from "react-redux";
import { allCourse } from '../../../redux/slice/couseSlice';
import getSweetAlert from "../../../util/alert/sweetAlert";
import { getInstructorStudentCount } from "../../../function/getStudentCountBasedOnSpecificInstructor";

const InstructorDashboard = ({ instructorDetails }) => {

  // console.log('Instructor data', instructorDetails);

  const dispatch = useDispatch(),
    [studentCount, setStudentCount] = useState(0),
    { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state.course);

  useEffect(() => {
    dispatch(allCourse({ instructor_id: instructorDetails?.id }))
      .then(res => {
        // console.log('Response for fetching instructorwise course', res);
      })
      .catch(err => {
        // console.log('Error occured', err);
        getSweetAlert("Error", "Something went wrong.", "error");
      })
  }, [dispatch]);

  useEffect(() => {
    const loadStudentCount = async () => {
      const count = await getInstructorStudentCount(instructorDetails?.id);
      setStudentCount(count);
    };

    loadStudentCount();
  }, [instructorDetails?.id]);

  // console.log('Get course details', getCourseData);




  const [data, setData] = useState({
    stats: { totalCourses: 0, totalStudents: 0 },  tasks:
      [
        { id: 1, task: "Review Assignment Submissions", course: "React Masterclass", date: "Oct 15, 2025", priority: "high", count: 23 },
        { id: 2, task: "Update Course Content", course: "Full Stack Dev", date: "Oct 18, 2025", priority: "medium", count: 5 },
        { id: 3, task: "Answer Student Questions", course: "UI/UX Design", date: "Oct 20, 2025", priority: "high", count: 12 }
      ]
    , monthly: { enrollments: 0, revenue: 0 }
  });

  const stats = [
    { icon: BookOpen, value: getCourseData?.length ?? 0, label: "Total Courses", color: "purple" },
    { icon: Users, value: studentCount?.toLocaleString(), label: "Total Students", color: "blue" }
  ];

  const quickActions = [
    { label: "Create New Course", icon: Plus, gradient: "from-purple-500/30 to-purple-600/30", func: () => window.dispatchEvent(new CustomEvent("open-add-course")) },
    { label: "View All Students", icon: Users, gradient: "from-blue-500/30 to-blue-600/30", func: () => console.log('All Students Clicked!') },
    { label: "Course Analytics", icon: BarChart3, gradient: "from-pink-500/30 to-pink-600/30", func: () => window.dispatchEvent(new CustomEvent("open-instructor-analytics")) }
  ];

  if (isCourseLoading || !instructorDetails || Object.keys(instructorDetails).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          <p className="text-purple-200 text-sm font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-3 sm:p-4 lg:p-6 xl:p-8 overflow-x-hidden">
      <div className="max-w-full mx-auto space-y-4 sm:space-y-5 lg:space-y-6">

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

            {/* ACTIVITY */}
            <InstructorRecentActivity instructorDetails={instructorDetails} />
          </div>

          {/* RIGHT COL */}
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">

            {/* TASKS */}
            <InstructorUpcommingTasks tasks={data.tasks} />

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