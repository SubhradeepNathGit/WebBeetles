import React from "react";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale,
    PointElement, LineElement,
    BarElement, Tooltip, Filler, Legend,
} from "chart.js";
import {ChevronRight} from "lucide-react";
import { Link } from "react-router-dom";
import StatCardHeader from "../../components/admin/dashboard/StatCardHeader";
import EnrollmentChartView from "../../components/admin/dashboard/chart/EnrollmentChartView";
import RecentStudents from "../../components/admin/dashboard/RecentStudents";
import PendingInstructorReview from "../../components/admin/dashboard/PendingInstructorReview";
import TopCourse from "../../components/admin/dashboard/TopCourse";
import PendingCourseApproval from "../../components/admin/dashboard/PendingCourseApproval";
import TopCategory from "../../components/admin/dashboard/TopCategory";
import PerformActivity from "../../components/admin/dashboard/PerformActivity";
import QuickActions from "../../components/admin/dashboard/QuickActions";
import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import RegistrationChartView from "../../components/admin/dashboard/chart/RegistrationChartView";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler, Legend);

// --- Top Courses Table ---
const TOP_COURSES = [
    { title: "Advanced React Patterns", instructor: "Dr. Sarah Jenkins", category: "Development", students: 2840, revenue: "₹1,42,000", rating: 4.9 },
    { title: "Python for Data Science", instructor: "Michael Chang", category: "Data", students: 2190, revenue: "₹1,09,500", rating: 4.8 },
    { title: "UI/UX Bootcamp 2024", instructor: "Jessica Wong", category: "Design", students: 1875, revenue: "₹93,750", rating: 4.7 },
    { title: "Node.js Mastery", instructor: "Prof. Arthur P.", category: "Development", students: 1460, revenue: "₹73,000", rating: 4.6 },
    { title: "Digital Marketing Pro", instructor: "Anita Desai", category: "Marketing", students: 1280, revenue: "₹64,000", rating: 4.5 },
];


export default function Dashboard() {

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <DashboardHeader />

            {/* === ROW 1: Stat Cards (8 cards in 4-col grid) === */}
            <StatCardHeader />

            {/* === ROW 2: Charts (2/3 + 1/3) === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <EnrollmentChartView />

                {/* Recent Students */}
                <RecentStudents />
            </div>

            {/* === ROW 3: Revenue chart + Two pending queues === */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Revenue bar */}
                <RegistrationChartView />

                {/* Pending Instructor Reviews */}
                <PendingInstructorReview />
            </div>

            {/* === ROW 4: Top Courses Table + Pending Course Queue === */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Top Courses Table */}
                <TopCourse TOP_COURSES={TOP_COURSES} />

                {/* Pending Course Approvals */}
                <PendingCourseApproval />
            </div>

            {/* === ROW 5: Top Categories + Platform Activity Feed === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Category Breakdown */}
                <TopCategory />

                {/* Activity Feed */}
                <PerformActivity />

                {/* Quick Actions */}
                <QuickActions />
            </div>
        </div>
    );
}
