import supabaseAdmin from "../util/supabase/supabaseAdmin";

export const getInstructorTotalRevenue = async (instructorId) => {
    if (!instructorId) return 0;

    const { data, error } = await supabaseAdmin
        .from("purchase_items")
        .select(`
            price,
            purchases!inner(payment_status),
            courses!inner(instructor_id)
        `)
        .eq("courses.instructor_id", instructorId)
        .eq("purchases.payment_status", "paid");

    if (error) {
        console.error("Error fetching total revenue:", error);
        return 0;
    }

    const totalRevenue = data.reduce((sum, item) => sum + Number(item.price), 0);
    return totalRevenue;
};
