import supabase from "../util/supabase/supabase";

export const getAppSettings = async () => {

     const res = await supabase.from("platform_settings").select("*").single();
    // console.log('Response for fetching platform data', res);

    if (res?.error) throw new Error(res?.error.message);

    return res?.data;
};