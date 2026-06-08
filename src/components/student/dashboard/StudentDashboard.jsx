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
    <div className="space-y-6 bg-black">
      {/* Header */}
      <StudentDashboardHeader userDetails={getStudentData} />

      {/* Subscription / Plan Card */}
      <StudentDashboardSubscriptionCard userDetails={getStudentData} />

      {/* Stats Row */}
      <StudentDashboardStats />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
        {/* Left — 2/3 */}
        <div className="lg:col-span-2 space-y-5 md:space-y-6">
          <StudentDashboardContinueLearning />
          <StudentDashboardRecentActivity studentDetails={getStudentData} />
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-5 md:space-y-6">
          <StudentDashboardDeadlines />
          <StudentDashboardWeeklyGoal />
          <StudentDashboardQuickAction />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
