import supabase from "../util/supabase/supabase";

export const fetchMonthlyRegistrations = async (year) => {
    const start = new Date(`${year}-01-01T00:00:00Z`).toISOString();
    const end = new Date(`${year}-12-31T23:59:59Z`).toISOString();

    const [studentsRes, instructorsRes] = await Promise.all([
        supabase
            .from("students")
            .select("created_at")
            .gte("created_at", start)
            .lte("created_at", end),

        supabase
            .from("instructors")
            .select("created_at")
            .gte("created_at", start)
            .lte("created_at", end),
    ]);

    if (studentsRes.error) throw studentsRes.error;
    if (instructorsRes.error) throw instructorsRes.error;

    return {
        students: studentsRes.data,
        instructors: instructorsRes.data,
    };
};