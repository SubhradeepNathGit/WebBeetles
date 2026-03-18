import supabase from "../util/supabase/supabase";

export const getCourseTotalRevenue = async (courseId) => {
    if (!courseId) throw new Error("Course ID is required");

    const { data, error } = await supabase.from("purchase_items").select("price").eq("course_id", courseId);

    if (error) throw error;

    return data.reduce((sum, row) => sum + Number(row.price), 0);
};