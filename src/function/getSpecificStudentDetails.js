import supabase from "../util/supabase/supabase";

export const fetchStudentDetails = async (studentId) => {
    if (!studentId) return null;

    const { data, error } = await supabase.from("students").select("*").eq("id", studentId).single();

    if (error) throw error;

    return data;
};
