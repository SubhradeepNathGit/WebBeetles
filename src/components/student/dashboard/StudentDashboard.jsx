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
    <div className="bg-black min-h-screen space-y-6 lg:space-y-8">
      {/* Premium Header */}
      <StudentDashboardHeader userDetails={getStudentData} />

      {/* Stats Row */}
      <StudentDashboardStats />

      {/* Main Content Grid - Seamless Premium Layout */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left — 2/3 */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          <StudentDashboardContinueLearning />
          <StudentDashboardRecentActivity studentDetails={getStudentData} />
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-6 lg:space-y-8">
          <StudentDashboardWeeklyGoal />
          <StudentDashboardSubscriptionCard userDetails={getStudentData} />
          <StudentDashboardQuickAction />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
