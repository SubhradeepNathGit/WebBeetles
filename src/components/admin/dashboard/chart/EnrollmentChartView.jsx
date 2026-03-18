import React, { useEffect, useState } from "react";
import RevenueChart from "../../charts/revenueChart";
import { fetchMonthlyRevenue } from "../../../../function/getPayments";

const RevenueChartView = () => {
    const currentYear = new Date().getFullYear();

    const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
    const [totalRevenue, setTotalRevenue] = useState(0);

    const buildMonthlyRevenue = (rows = []) => {
        const monthly = Array(12).fill(0);

        rows.forEach((row) => {
            if (!row?.created_at) return;

            const date = new Date(row.created_at);
            const monthIndex = date.getMonth();

            monthly[monthIndex] += Number(row.amount || 0);
        });

        return monthly;
    };

    const calculateTotalRevenue = (rows = []) =>
        rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);

    useEffect(() => {
        fetchMonthlyRevenue(currentYear)
            .then(rows => {
                setMonthlyRevenue(buildMonthlyRevenue(rows));
                setTotalRevenue(calculateTotalRevenue(rows));
            })
            .catch(console.error);
    }, [currentYear]);

    return (
        <div className="bg-[#111] p-6 rounded-2xl border border-white/5 lg:col-span-2 shadow-xl">
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-base font-semibold text-white">
                    Monthly Revenue
                </h2>
                <span className="text-xs text-gray-500">
                    {currentYear} — All Payments
                </span>
            </div>

            <p className="text-2xl font-bold text-white mb-6">
                ₹{totalRevenue.toLocaleString("en-IN")}
                {/* <span className="text-sm font-normal text-green-500 ml-1">
                    +18.6%
                </span> */}
            </p>

            <div className="h-56">
                <RevenueChart monthlyRevenue={monthlyRevenue} />
            </div>
        </div>
    );
};

export default RevenueChartView;