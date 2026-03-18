import supabase from "../util/supabase/supabase";

export const getInstructorStats = async (instructorId) => {
    if (!instructorId) throw new Error("Instructor ID required");

    const { data, error } = await supabase.from("purchase_items")
        .select(`price,purchases!inner(user_id, payment_status),courses!inner(instructor_id)`)
        .eq("courses.instructor_id", instructorId).eq("purchases.payment_status", "paid");

    if (error) throw new Error(error.message);

    const totalRevenue = data.reduce((sum, item) => sum + Number(item.price), 0);

    const uniqueStudents = new Set(
        data.map((item) => item.purchases.user_id)
    );

    return {
        totalRevenue,
        totalStudents: uniqueStudents.size,
    };
};