import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import baseChartOptions from "../dashboard/common/ChartOptions";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const RevenueChart = ({ monthlyRevenue }) => {
    const chartData = useMemo(() => ({
        labels: MONTHS,
        datasets: [{
            label: "Revenue",
            data: monthlyRevenue,
            fill: true,
            backgroundColor: (ctx) => {
                const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 240);
                g.addColorStop(0, "rgba(34,197,94,0.3)");
                g.addColorStop(1, "rgba(34,197,94,0)");
                return g;
            },
            borderColor: "#22c55e",
            borderWidth: 2.5,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#22c55e",
            pointHoverBorderColor: "#fff",
        }],
    }), [monthlyRevenue]);

    return <Line data={chartData} options={baseChartOptions({ prefix: "₹" })} />;
};

export default RevenueChart;