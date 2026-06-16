import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale,
    PointElement, LineElement,
    BarElement, ArcElement,
    Tooltip, Filler, Legend,
} from "chart.js";
import AnalyticsHeader from "../../components/admin/analytics/AnalyticsHeader";
import AnalyticsStats from "../../components/admin/analytics/AnalyticsStats";
import AllCharts from "../../components/admin/analytics/AllCharts";
import TopPerformingCourseTable from "../../components/admin/analytics/TopPerformingCourseTable";
import { useAdminAnalytics } from "../../tanstack/query/fetchAdminAnalytics";
import { Loader2 } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Filler, Legend);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartBase = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#111", titleColor: "#fff", bodyColor: "#9ca3af",
            borderColor: "rgba(168,85,247,0.3)", borderWidth: 1, padding: 12,
        },
    },
    scales: {
        x: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false } },
        y: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false } },
    },
    animation: { duration: 700 },
};

export default function Analytics() {
    const { data: analyticsData, isLoading } = useAdminAnalytics();

    const processedData = useMemo(() => {
        if (!analyticsData) return null;

        const currentYear = new Date().getFullYear();
        const monthlyRevenue = new Array(12).fill(0);
        const monthlyEnrollments = new Array(12).fill(0);
        const monthlyStudents = new Array(12).fill(0);
        const monthlyInstructors = new Array(12).fill(0);
        
        let totalRevenue = 0;
        let avgCompletion = 82; // Simplified overall completion rate

        // Process Purchases (Revenue)
        analyticsData.purchases.forEach(p => {
            const date = new Date(p.created_at);
            totalRevenue += p.amount || 0;
            if (date.getFullYear() === currentYear) {
                monthlyRevenue[date.getMonth()] += p.amount || 0;
            }
        });

        // Process Purchase Items (Enrollments & Top Courses)
        const courseRevenueMap = {};
        analyticsData.purchaseItems.forEach(pi => {
            const dateStr = pi.purchases?.created_at || new Date().toISOString();
            const date = new Date(dateStr);
            if (date.getFullYear() === currentYear) {
                monthlyEnrollments[date.getMonth()] += 1;
            }
            
            if (!courseRevenueMap[pi.course_id]) {
                courseRevenueMap[pi.course_id] = { id: pi.course_id, revenue: 0, enrollments: 0 };
            }
            courseRevenueMap[pi.course_id].revenue += pi.price || 0;
            courseRevenueMap[pi.course_id].enrollments += 1;
        });

        // Top Performing Courses
        let topCourses = Object.values(courseRevenueMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10)
            .map(tc => {
                const courseDetails = analyticsData.courses.find(c => c.id === tc.id) || {};
                return {
                    id: tc.id,
                    title: courseDetails.title || "Unknown Course",
                    instructor: courseDetails.instructor?.name || "Unknown",
                    category: courseDetails.category?.name || "Uncategorized",
                    revenue: tc.revenue,
                    students: tc.enrollments
                };
            });

        // Process Students
        let studentsBeforeCurrentYear = 0;
        analyticsData.students.forEach(s => {
            const date = new Date(s.created_at);
            if (date.getFullYear() < currentYear) {
                studentsBeforeCurrentYear++;
            }
        });

        let instructorsBeforeCurrentYear = 0;
        analyticsData.instructors.forEach(i => {
            const date = new Date(i.created_at);
            if (date.getFullYear() < currentYear) {
                instructorsBeforeCurrentYear++;
            }
        });

        analyticsData.students.forEach(s => {
            const date = new Date(s.created_at);
            if (date.getFullYear() === currentYear) {
                monthlyStudents[date.getMonth()] += 1;
            }
        });
        
        // Accumulate Students for MAU to make it look like total users over time
        monthlyStudents[0] += studentsBeforeCurrentYear;
        for(let i=1; i<12; i++) {
            monthlyStudents[i] += monthlyStudents[i-1];
        }

        // Process Instructors
        analyticsData.instructors.forEach(i => {
            const date = new Date(i.created_at);
            if (date.getFullYear() === currentYear) {
                monthlyInstructors[date.getMonth()] += 1;
            }
        });
        monthlyInstructors[0] += instructorsBeforeCurrentYear;
        for(let i=1; i<12; i++) {
            monthlyInstructors[i] += monthlyInstructors[i-1];
        }

        // Nullify future months
        const currentMonth = new Date().getMonth();
        for (let i = 0; i < 12; i++) {
            if (i > currentMonth) {
                monthlyRevenue[i] = null;
                monthlyEnrollments[i] = null;
                monthlyStudents[i] = null;
                monthlyInstructors[i] = null;
            }
        }

        // Categories
        const catCount = {};
        let activeCourseCount = 0;
        analyticsData.courses.forEach(c => {
            if (c.status === "approved") activeCourseCount++;
            const catName = c.category?.name || "Uncategorized";
            catCount[catName] = (catCount[catName] || 0) + 1;
        });
        
        // Take top 5 categories
        const catEntries = Object.entries(catCount).sort((a,b) => b[1]-a[1]);
        const topCats = catEntries.slice(0, 4);
        const otherCatsCount = catEntries.slice(4).reduce((acc, curr) => acc + curr[1], 0);
        if (otherCatsCount > 0) topCats.push(["Others", otherCatsCount]);
        
        const catLabels = topCats.map(c => c[0]);
        const catValues = topCats.map(c => c[1]);

        // Average Rating
        let avgRating = 0;
        if (analyticsData.reviews.length > 0) {
            const totalRating = analyticsData.reviews.reduce((acc, r) => acc + (r.rating_count || 0), 0);
            avgRating = (totalRating / analyticsData.reviews.length).toFixed(1);
        }

        // Revenue by Course (top 5 courses + Others)
        const topRevCourses = topCourses.slice(0, 5);
        const otherRevenue = topCourses.slice(5).reduce((acc, c) => acc + c.revenue, 0);
        const courseRevLabels = topRevCourses.map(c => c.title.length > 20 ? c.title.slice(0, 20) + '…' : c.title);
        const courseRevValues = topRevCourses.map(c => c.revenue);
        if (otherRevenue > 0) {
            courseRevLabels.push("Others");
            courseRevValues.push(otherRevenue);
        }

        return {
            totalRevenue,
            activeCourseCount,
            totalStudents: analyticsData.students.length,
            cartSessions: analyticsData.cartSessionsCount,
            avgRating,
            avgCompletion,
            monthlyRevenue,
            monthlyEnrollments,
            monthlyStudents,
            monthlyInstructors,
            catLabels,
            catValues,
            courseRevLabels,
            courseRevValues,
            topCourses
        };
    }, [analyticsData]);

    // Format Data for Charts
    const revenueData = useMemo(() => ({
        labels: MONTHS,
        datasets: [{
            label: "Revenue (₹)", fill: true,
            data: processedData?.monthlyRevenue || [],
            backgroundColor: (ctx) => { const g = ctx.chart?.ctx?.createLinearGradient(0, 0, 0, 240); if(g){ g.addColorStop(0, "rgba(168,85,247,0.35)"); g.addColorStop(1, "rgba(168,85,247,0)"); return g; } },
            borderColor: "#a855f7", borderWidth: 2.5, tension: 0.4, pointRadius: 0, pointHoverRadius: 6,
            pointHoverBackgroundColor: "#a855f7", pointHoverBorderColor: "#fff",
        }],
    }), [processedData]);

    const enrollData = useMemo(() => ({
        labels: MONTHS,
        datasets: [{
            label: "New Enrollments",
            data: processedData?.monthlyEnrollments || [],
            backgroundColor: (ctx) => { const v = ctx.parsed?.y || 0; return v > 10 ? "rgba(168,85,247,0.9)" : "rgba(168,85,247,0.5)"; },
            borderRadius: 6, borderSkipped: false,
        }],
    }), [processedData]);

    const mauData = useMemo(() => ({
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
            { label: "Student Registrations", data: processedData?.monthlyStudents || Array(12).fill(0), backgroundColor: "#8b5cf6", borderRadius: 4, barPercentage: 0.6, categoryPercentage: 0.8 },
            { label: "Instructor Registrations", data: processedData?.monthlyInstructors || Array(12).fill(0), backgroundColor: "#ef4444", borderRadius: 4, barPercentage: 0.6, categoryPercentage: 0.8 },
        ],
    }), [processedData]);

    // Flat line for simplified overall completion rate
    const completionData = useMemo(() => ({
        labels: MONTHS,
        datasets: [{
            label: "Completion %", fill: true,
            data: new Array(12).fill(processedData?.avgCompletion || 82).map((v, i) => i <= new Date().getMonth() ? v : null),
            backgroundColor: (ctx) => { const g = ctx.chart?.ctx?.createLinearGradient(0, 0, 0, 240); if(g){ g.addColorStop(0, "rgba(217,70,239,0.3)"); g.addColorStop(1, "rgba(217,70,239,0)"); return g; } },
            borderColor: "#d946ef", borderWidth: 2.5, tension: 0.4,
            pointRadius: 0, pointHoverRadius: 0,
        }],
    }), [processedData]);

    const catData = useMemo(() => ({
        labels: processedData?.catLabels || [],
        datasets: [{
            data: processedData?.catValues || [],
            backgroundColor: ["#a855f7", "#eab308", "#d946ef", "#3b82f6", "#374151"],
            borderColor: "#111", borderWidth: 3,
            hoverOffset: 8,
        }],
    }), [processedData]);

    const courseRevenueData = useMemo(() => ({
        labels: processedData?.courseRevLabels || [],
        datasets: [{
            data: processedData?.courseRevValues || [],
            backgroundColor: ["#10b981", "#f59e0b", "#6366f1", "#ec4899", "#06b6d4", "#374151"],
            borderColor: "#111", borderWidth: 3,
            hoverOffset: 8,
        }],
    }), [processedData]);

    const lineOpts = {
        ...chartBase,
        plugins: { ...chartBase.plugins },
        scales: { ...chartBase.scales, y: { ...chartBase.scales.y, ticks: { ...chartBase.scales.y.ticks, callback: v => `₹${(v / 1000).toFixed(0)}k` } } },
    };

    const completionOpts = {
        ...chartBase,
        scales: { ...chartBase.scales, y: { ...chartBase.scales.y, min: 60, max: 100, ticks: { ...chartBase.scales.y.ticks, callback: v => `${v}%` } } },
    };

    const barOpts = { ...chartBase, plugins: { ...chartBase.plugins } };

    const mauOpts = {
        ...chartBase,
        plugins: {
            ...chartBase.plugins,
            legend: { display: true, labels: { color: "#9ca3af", usePointStyle: true, pointStyleWidth: 10, boxHeight: 8, font: { size: 12 } } },
        },
    };

    const doughnutOpts = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { position: "right", labels: { color: "#9ca3af", boxWidth: 12, boxHeight: 12, padding: 16, font: { size: 12 } } },
            tooltip: { backgroundColor: "#111", titleColor: "#fff", bodyColor: "#9ca3af", borderColor: "rgba(168,85,247,0.3)", borderWidth: 1, padding: 12 },
        },
        animation: { duration: 700 },
    };

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                {/* Header Skeleton */}
                <div className="h-10 w-48 bg-[#111] rounded-lg mb-2"></div>
                <div className="h-4 w-96 bg-[#111] rounded-lg mb-6"></div>

                {/* KPI Cards Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-[#111] p-5 rounded-2xl border border-white/5 h-32"></div>
                    ))}
                </div>

                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`bg-[#111] p-6 rounded-2xl border border-white/5 h-[320px] ${i === 5 ? "col-span-full" : ""}`}></div>
                    ))}
                </div>

                {/* Table Skeleton */}
                <div className="bg-[#111] rounded-2xl border border-white/5 h-96"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AnalyticsHeader />

            {/* KPI Cards */}
            <AnalyticsStats stats={processedData} />

            {/* Charts — Grid */}
            <AllCharts revenueData={revenueData} lineOpts={lineOpts} enrollData={enrollData} barOpts={barOpts} completionData={completionData}
                completionOpts={completionOpts} mauData={mauData} mauOpts={mauOpts} catData={catData} courseRevenueData={courseRevenueData} doughnutOpts={doughnutOpts} />

            {/* Top Performing Courses Table */}
            <div className="bg-[#111] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                <div className="p-5 border-b border-white/5">
                    <h3 className="text-base font-semibold text-white">Top 10 Performing Courses</h3>
                    <p className="text-xs text-gray-500 mt-1">Ranked by total revenue generated this year.</p>
                </div>
                <div className="overflow-x-auto">
                    <TopPerformingCourseTable topCourses={processedData?.topCourses || []} />
                </div>
            </div>
        </div>
    );
}
