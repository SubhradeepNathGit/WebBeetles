import supabase from "../util/supabase/supabase";

export const fetchMonthlyRevenue = async (year) => {

    const start = `${year}-01-01T00:00:00.000Z`;
    const end = `${year}-12-31T23:59:59.999Z`;

    const { data, error } = await supabase.from("payment_details").select("amount, created_at").eq("status", "paid")
        .gte("created_at", start).lte("created_at", end);

    if (error) throw error;
    return data;
};