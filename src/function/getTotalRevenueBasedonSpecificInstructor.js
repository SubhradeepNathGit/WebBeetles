import supabase from "../util/supabase/supabase";

export const getInstructorTotalRevenue = async (instructorId) => {
    if (!instructorId) return 0;

    // Get instructor courses
    const { data: courses, error: courseError } = await supabase.from("courses").select("id").eq("instructor_id", instructorId).eq("is_deleted", false);

    if (courseError || !courses?.length) {
        console.error(courseError);
        return 0;
    }

    const courseIds = courses.map(c => c.id);

    // Get purchase items for those courses
    const { data: purchaseItems, error: itemError } = await supabase.from("purchase_items").select("price, purchase_id").in("course_id", courseIds);

    if (itemError || !purchaseItems?.length) {
        console.error(itemError);
        return 0;
    }

    const purchaseIds = [...new Set(purchaseItems.map(p => p.purchase_id))];

    // Get only PAID purchases
    const { data: paidPurchases, error: purchaseError } = await supabase.from("purchases").select("id").in("id", purchaseIds).eq("payment_status", "paid");

    if (purchaseError || !paidPurchases?.length) {
        console.error(purchaseError);
        return 0;
    }

    const paidPurchaseIds = new Set(paidPurchases.map(p => p.id));

    // Sum revenue
    const totalRevenue = purchaseItems.filter(item => paidPurchaseIds.has(item.purchase_id))
        .reduce((sum, item) => sum + Number(item.price), 0);

    return totalRevenue;
};
