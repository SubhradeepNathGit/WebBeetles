import supabase from "../util/supabase/supabase";

export const getCourseStudents = async (courseId) => {

    if (!courseId) throw new Error("Course ID required");

    // 1️⃣ Get purchase items for the course
    const { data: purchaseItems, error: itemError } = await supabase
        .from("purchase_items")
        .select("purchase_id, price")
        .eq("course_id", courseId);

    if (itemError) throw itemError;

    if (!purchaseItems?.length) return [];

    const purchaseIds = purchaseItems.map((item) => item.purchase_id);

    // 2️⃣ Get purchases
    const { data: purchases, error: purchaseError } = await supabase
        .from("purchases")
        .select("id, user_id, payment_status")
        .in("id", purchaseIds)
        .eq("payment_status", "paid");

    if (purchaseError) throw purchaseError;

    if (!purchases?.length) return [];

    const userIds = purchases.map((p) => p.user_id);

    // 3️⃣ Fetch students
    const { data: students, error: studentError } = await supabase
        .from("students")
        .select("id, name, email, profile_image_url, last_login")
        .in("id", userIds);

    if (studentError) throw studentError;

    // 4️⃣ Map purchase price
    const purchaseMap = {};
    purchaseItems.forEach((item) => {
        purchaseMap[item.purchase_id] = item.price;
    });

    // 5️⃣ Combine data
    const result = purchases.map((purchase) => {
        const student = students.find((s) => s.id === purchase.user_id);

        return {
            purchase_id: purchase.id,
            student_id: student?.id,
            name: student?.name,
            email: student?.email,
            profile_image_url: student?.profile_image_url,
            last_login: student?.last_login,
            price_paid: purchaseMap[purchase.id],
        };
    });

    return result;
};