import supabase from "../util/supabase/supabase";

export const fetchCategoryWithLectures = async (categoryId) => {
    if (!categoryId) throw new Error("categoryId is required");

    const { data, error } = await supabase.from("categories").select(`*,courses (*,category:categories(*),instructor:instructors (*),lectures (*))`).eq("id", categoryId).single();

    if (error) throw error;

    return data;
};