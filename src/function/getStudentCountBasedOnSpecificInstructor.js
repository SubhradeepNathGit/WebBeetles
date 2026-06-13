import supabaseAdmin from "../util/supabase/supabaseAdmin";

export const getInstructorStudentCount = async (instructorId) => {
    if (!instructorId) return 0;

    const { data, error } = await supabaseAdmin
        .from("purchase_items")
        .select(`
            purchases!inner(user_id, payment_status),
            courses!inner(instructor_id)
        `)
        .eq("courses.instructor_id", instructorId)
        .eq("purchases.payment_status", "paid");

    if (error) {
        console.error("Error fetching student count:", error);
        return 0;
    }

    const uniqueStudents = new Set(data.map(item => item.purchases.user_id));
    return uniqueStudents.size;
};
