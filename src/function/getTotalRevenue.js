import supabase from "../util/supabase/supabase";

export const getTotalRevenue = async () => {

    const res = await supabase.from('purchases').select('amount');
    // console.log('Response for fetching all amount', res);

    return res?.data;
};
