import supabase from "../util/supabase/supabase";

const getMonthRange = (date) => {
    const start = new Date(date);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

export const getInstructorMonthlyStats = async ({ instructorId }) => {
    const now = new Date();

    const current = getMonthRange(now);
    const previous = getMonthRange(
        new Date(now.getFullYear(), now.getMonth() - 1, 1)
    );

    const fetchData = async ({ start, end }) => {
        const { data, error } = await supabase
            .from("purchase_items").select(`price,courses!inner (instructor_id),purchases!inner (created_at)`)
            .eq("courses.instructor_id", instructorId)
            .gte("purchases.created_at", start.toISOString())
            .lte("purchases.created_at", end.toISOString());

        if (error) throw error;
        return data;
    };

    const currentData = await fetchData(current);
    const previousData = await fetchData(previous);

    const calc = (data) => ({
        revenue: data.reduce((s, i) => s + Number(i.price), 0),
        enrollments: data.length
    });

    const curr = calc(currentData);
    const prev = calc(previousData);

    const percent = (curr, prev) =>
        prev === 0 ? 100 : Math.round(((curr - prev) / prev) * 100);

    return {
        totalRevenue: curr.revenue,
        totalEnrollments: curr.enrollments,
        revenueChange: percent(curr.revenue, prev.revenue),
        enrollmentChange: percent(curr.enrollments, prev.enrollments)
    };
};