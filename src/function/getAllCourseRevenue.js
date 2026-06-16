import supabaseAdmin from "../util/supabase/supabaseAdmin";

export const getAllCoursesRevenue = async (courseIds) => {
    if (!courseIds.length) return {};

    const { data, error } = await supabaseAdmin.from("purchase_items").select("course_id, price").in("course_id", courseIds);

    if (error) throw error;

    return data.reduce((acc, row) => {
        acc[row.course_id] =
            (acc[row.course_id] || 0) + Number(row.price || 0);
        return acc;
    }, {});
};
