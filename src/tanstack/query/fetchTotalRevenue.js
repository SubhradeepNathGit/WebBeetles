import { useQuery } from "@tanstack/react-query";
import { getTotalRevenue } from "../../function/getTotalRevenue";

export const useTotalRevenue = () => {

    return useQuery({
        queryKey: ["total-revenue"],
        queryFn: () => getTotalRevenue()
    });
};
