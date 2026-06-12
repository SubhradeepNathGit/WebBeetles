import { useQuery } from "@tanstack/react-query";
import supabaseAdmin from "../../util/supabase/supabaseAdmin";

const fetchContacts = async () => {
    // using supabaseAdmin to bypass RLS and fetch all contact queries
    const { data, error } = await supabaseAdmin.from('contacts').select('*').order('created_at', { ascending: false });
    
    if (error) {
        throw new Error(error.message);
    }
    
    return data;
};

export const useFetchContactMessages = () => {
    return useQuery({
        queryKey: ['contact-messages'],
        queryFn: fetchContacts,
    });
};
