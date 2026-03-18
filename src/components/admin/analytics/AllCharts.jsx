import React from 'react'
import { Bar, Doughnut, Line } from 'react-chartjs-2';

function ChartCard({ title, children, subtitle, full = false }) {
    return (
        <div className={`bg-[#111] p-6 rounded-2xl border border-white/5 shadow-xl ${full ? "col-span-full" : ""}`}>
            <div className="flex items-start justify-between mb-1">
                <h3 className="text-base font-semibold text-white">{title}</h3>
            </div>
            {subtitle && <p className="text-xs text-gray-500 mb-5">{subtitle}</p>}
            <div className="h-60">{children}</div>
        </div>
    );
}

const AllCharts = ({ revenueData, lineOpts, enrollData, barOpts, completionData, completionOpts, mauData, mauOpts, catData, doughnutOpts, deviceData }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Revenue Growth (2024)" subtitle="Monthly platform revenue from all course purchases">
                <Line data={revenueData} options={lineOpts} />
            </ChartCard>
            <ChartCard title="Monthly Enrollments (2024)" subtitle="Number of new course enrollments per month">
                <Bar data={enrollData} options={barOpts} />
            </ChartCard>
            <ChartCard title="Course Completion Rate" subtitle="Average completion % across all published courses">
                <Line data={completionData} options={completionOpts} />
            </ChartCard>
            <ChartCard title="Monthly Active Users" subtitle="Students and instructors actively using the platform">
                <Bar data={mauData} options={mauOpts} />
            </ChartCard>
            <ChartCard title="Courses by Category">
                <Doughnut data={catData} options={doughnutOpts} />
            </ChartCard>
            <ChartCard title="User Traffic by Device">
                <Doughnut data={deviceData} options={doughnutOpts} />
            </ChartCard>
        </div>
    )
}

export default AllCharts