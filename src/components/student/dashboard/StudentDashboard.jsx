import React from "react";
import StudentDashboardHeader from "./student-dashboard/StudentDashboardHeader";
import StudentDashboardStats from "./student-dashboard/StudentDashboardStats";
import StudentDashboardContinueLearning from "./student-dashboard/StudentDashboardContinueLearning";
import StudentDashboardRecentActivity from "./student-dashboard/StudentDashboardRecentActivity";
import StudentDashboardDeadlines from "./student-dashboard/StudentDashboardDeadlines";
import StudentDashboardWeeklyGoal from "./student-dashboard/StudentDashboardWeeklyGoal";
import StudentDashboardQuickAction from "./student-dashboard/StudentDashboardQuickAction";
import StudentDashboardSubscriptionCard from "./student-dashboard/StudentDashboardSubscriptionCard";

const StudentDashboard = ({ studentDetails: getStudentData }) => {
  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden bg-black min-h-screen space-y-5 sm:space-y-6 lg:space-y-8">
      {/* Premium Header */}
      <StudentDashboardHeader userDetails={getStudentData} />

      {/* Stats Row */}
      <StudentDashboardStats />

      {/* Main Content Grid - Seamless Premium Layout */}
      <div className="grid min-w-0 grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left — 2/3 */}
        <div className="min-w-0 space-y-5 sm:space-y-6 lg:col-span-2 lg:space-y-8">
          <StudentDashboardContinueLearning />
          <StudentDashboardRecentActivity studentDetails={getStudentData} />
        </div>

        {/* Right — 1/3 */}
        <div className="min-w-0 space-y-5 sm:space-y-6 lg:space-y-8">
          <StudentDashboardWeeklyGoal />
          <StudentDashboardSubscriptionCard userDetails={getStudentData} />
          <StudentDashboardQuickAction />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
