import React from "react";
import StudentDashboardHeader from "./student-dashboard/StudentDashboardHeader";
import StudentDashboardStats from "./student-dashboard/StudentDashboardStats";
import StudentDashboardContinueLearning from "./student-dashboard/StudentDashboardContinueLearning";
import StudentDashboardRecentActivity from "./student-dashboard/StudentDashboardRecentActivity";
import StudentDashboardDeadlines from "./student-dashboard/StudentDashboardDeadlines";
import StudentDashboardWeeklyGoal from "./student-dashboard/StudentDashboardWeeklyGoal";
import StudentDashboardQuickAction from "./student-dashboard/StudentDashboardQuickAction";

const StudentDashboard = ({ studentDetails: getStudentData }) => {

  // console.log('Logged student data', getStudentData);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 overflow-y-auto">

      {/* Header */}
      <StudentDashboardHeader userDetails={getStudentData} />

      {/* Stats Cards */}
      <StudentDashboardStats />

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Continue Learning */}
          <StudentDashboardContinueLearning />

          {/* Recent Activity */}
          <StudentDashboardRecentActivity studentDetails={getStudentData} />
        </div>


        {/* Sidebar */}
        <div className="space-y-6 md:space-y-8">
          {/* Deadlines */}
          <StudentDashboardDeadlines />

          {/* Weekly Goal */}
          <StudentDashboardWeeklyGoal />

          {/* Quick Actions */}
          <StudentDashboardQuickAction />

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;