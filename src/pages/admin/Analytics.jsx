import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale, LinearScale,
    PointElement, LineElement,
    BarElement, ArcElement,
    Tooltip, Filler, Legend,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Star } from "lucide-react";
import AnalyticsHeader from "../../components/admin/analytics/AnalyticsHeader";
import AnalyticsStats from "../../components/admin/analytics/AnalyticsStats";
import AllCharts from "../../components/admin/analytics/AllCharts";
import TopPerformingCourseTable from "../../components/admin/analytics/TopPerformingCourseTable";

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
    // Revenue line
    const revenueData = useMemo(() => ({
        labels: MONTHS,
        datasets: [{
            label: "Revenue (₹)", fill: true,
            data: [45000, 62000, 54000, 78000, 91000, 105000, 98000, 122000, 118000, 138000, 143000, 165000],
            backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 240); g.addColorStop(0, "rgba(168,85,247,0.35)"); g.addColorStop(1, "rgba(168,85,247,0)"); return g; },
            borderColor: "#a855f7", borderWidth: 2.5, tension: 0.4, pointRadius: 0, pointHoverRadius: 6,
            pointHoverBackgroundColor: "#a855f7", pointHoverBorderColor: "#fff",
        }],
    }), []);

    // Enrollment bar
    const enrollData = useMemo(() => ({
        labels: MONTHS,
        datasets: [{
            label: "New Enrollments",
            data: [310, 420, 380, 520, 490, 640, 580, 710, 660, 820, 775, 940],
            backgroundColor: (ctx) => { const v = ctx.parsed?.y || 0; return v > 700 ? "rgba(168,85,247,0.9)" : "rgba(168,85,247,0.5)"; },
            borderRadius: 6, borderSkipped: false,
        }],
    }), []);

    // Monthly Active Users
    const mauData = useMemo(() => ({
        labels: MONTHS,
        datasets: [
            {
                label: "Students",
                data: [3200, 3800, 3600, 4500, 4200, 5100, 4800, 5600, 5300, 6200, 5900, 6800],
                backgroundColor: "rgba(168,85,247,0.6)", borderRadius: 5, borderSkipped: false,
            },
            {
                label: "Instructors",
                data: [90, 105, 98, 120, 115, 130, 122, 140, 135, 148, 143, 152],
                backgroundColor: "rgba(234,179,8,0.6)", borderRadius: 5, borderSkipped: false,
            },
        ],
    }), []);

    // Completion rate line
    const completionData = useMemo(() => ({
        labels: MONTHS,
        datasets: [{
            label: "Completion %", fill: true,
            data: [72, 75, 68, 78, 82, 85, 81, 87, 89, 86, 90, 92],
            backgroundColor: (ctx) => { const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 240); g.addColorStop(0, "rgba(217,70,239,0.3)"); g.addColorStop(1, "rgba(217,70,239,0)"); return g; },
            borderColor: "#d946ef", borderWidth: 2.5, tension: 0.4,
            pointRadius: 4, pointBackgroundColor: "#d946ef", pointBorderColor: "#1a1a1a", pointBorderWidth: 2,
            pointHoverRadius: 7,
        }],
    }), []);

    // Doughnut - category
    const catData = useMemo(() => ({
        labels: ["Web Dev", "Data Science", "Design", "Marketing", "Others"],
        datasets: [{
            data: [38, 27, 18, 10, 7],
            backgroundColor: ["#a855f7", "#eab308", "#d946ef", "#3b82f6", "#374151"],
            borderColor: "#111", borderWidth: 3,
            hoverOffset: 8,
        }],
    }), []);

    // Doughnut - device
    const deviceData = useMemo(() => ({
        labels: ["Desktop", "Mobile", "Tablet"],
        datasets: [{
            data: [54, 38, 8],
            backgroundColor: ["#a855f7", "#eab308", "#7c3aed"],
            borderColor: "#111", borderWidth: 3,
            hoverOffset: 8,
        }],
    }), []);

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

    return (
        <div className="space-y-6">
            <AnalyticsHeader />

            {/* KPI Cards */}
            <AnalyticsStats />

            {/* Charts — Grid */}
            <AllCharts revenueData={revenueData} lineOpts={lineOpts} enrollData={enrollData} barOpts={barOpts} completionData={completionData}
                completionOpts={completionOpts} mauData={mauData} mauOpts={mauOpts} catData={catData} doughnutOpts={doughnutOpts} deviceData={deviceData} />

            {/* Top Performing Courses Table */}
            <div className="bg-[#111] rounded-2xl border border-white/5 shadow-xl overflow-hidden">
                <div className="p-5 border-b border-white/5">
                    <h3 className="text-base font-semibold text-white">Top 10 Performing Courses</h3>
                    <p className="text-xs text-gray-500 mt-1">Ranked by total revenue generated this year.</p>
                </div>
                <div className="overflow-x-auto">
                    <TopPerformingCourseTable />
                </div>
            </div>
        </div>
    );
}
