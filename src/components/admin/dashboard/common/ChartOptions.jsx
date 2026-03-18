
const baseChartOptions = (yLabel = "") => ({
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: "#111",
            titleColor: "#fff", bodyColor: "#9ca3af",
            borderColor: "rgba(168,85,247,0.3)", borderWidth: 1,
            padding: 12, displayColors: false,
            callbacks: {
                label: (ctx) => `${yLabel}${ctx.parsed.y.toLocaleString()}`,
            },
        },
    },
    scales: {
        x: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false } },
        y: { ticks: { color: "#6b7280", font: { size: 11 } }, grid: { color: "rgba(255,255,255,0.04)" }, border: { display: false } },
    },
    animation: { duration: 700, easing: "easeInOutQuart" },
});

export default baseChartOptions;