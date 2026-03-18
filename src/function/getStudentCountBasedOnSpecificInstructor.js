import supabase from "../util/supabase/supabase";

export const getInstructorStudentCount = async (instructorId) => {
    if (!instructorId) return 0;

    // Get all courses of instructor
    const { data: courses, error: courseError } = await supabase.from("courses").select("id").eq("instructor_id", instructorId).eq("is_deleted", false);

    if (courseError || !courses?.length) {
        console.error(courseError);
        return 0;
    }

    const courseIds = courses.map(c => c.id);

    // Get purchase items for those courses
    const { data: purchaseItems, error: purchaseItemError } = await supabase.from("purchase_items").select("purchase_id").in("course_id", courseIds);

    if (purchaseItemError || !purchaseItems?.length) {
        console.error(purchaseItemError);
        return 0;
    }

    const purchaseIds = [...new Set(purchaseItems.map(p => p.purchase_id))];

    // Get purchases & count unique users
    const { data: purchases, error: purchaseError } = await supabase.from("purchases").select("user_id").in("id", purchaseIds).eq("payment_status", "paid");

    if (purchaseError) {
        console.error(purchaseError);
        return 0;
    }

    const uniqueStudents = new Set(
        purchases.map(p => p.user_id)
    );

    return uniqueStudents.size;
};
