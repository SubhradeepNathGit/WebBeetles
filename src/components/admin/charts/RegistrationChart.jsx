import React, { useEffect, useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import baseChartOptions from "../dashboard/common/ChartOptions";
import { fetchMonthlyRegistrations } from "../../../function/getRegistrations";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function RegistrationChart() {
    const currentYear = new Date().getFullYear();
    const [studentData, setStudentData] = useState(Array(12).fill(0));
    const [instructorData, setInstructorData] = useState(Array(12).fill(0));

    const buildMonthlyCount = (rows = []) => {
        const counts = Array(12).fill(0);

        rows.forEach((r) => {
            const m = new Date(r.created_at).getMonth();
            counts[m] += 1;
        });

        return counts;
    };

    useEffect(() => {
        fetchMonthlyRegistrations(currentYear)
            .then(({ students, instructors }) => {
                setStudentData(buildMonthlyCount(students));
                setInstructorData(buildMonthlyCount(instructors));
            })
            .catch(console.error);
    }, [currentYear]);

    const data = useMemo(() => ({
        labels: MONTHS,
        datasets: [
            {
                label: "Student Registrations",
                data: studentData,
                backgroundColor: "rgba(168,85,247,0.6)",
                borderRadius: 6,
                borderSkipped: false,
            },
            {
                label: "Instructor Registrations",
                data: instructorData,
                backgroundColor: "rgba(34,197,94,0.5)",
                borderRadius: 6,
                borderSkipped: false,
            },
        ],
    }), [studentData, instructorData]);

    const options = {
        ...baseChartOptions(),
        plugins: {
            ...baseChartOptions().plugins,
            legend: {
                display: true,
                labels: {
                    color: "#9ca3af",
                    usePointStyle: true,
                    boxHeight: 8,
                    font: { size: 12 },
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
}

export default RegistrationChart;