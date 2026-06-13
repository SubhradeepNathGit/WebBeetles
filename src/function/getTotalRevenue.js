import supabaseAdmin from "../util/supabase/supabaseAdmin";

export const getTotalRevenue = async () => {

    const res = await supabaseAdmin.from('purchases').select('amount');
    // console.log('Response for fetching all amount', res);

    return res?.data;
};
