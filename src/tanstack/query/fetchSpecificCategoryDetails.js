import { useQuery } from "@tanstack/react-query";
import { fetchCategoryWithLectures } from "../../function/getSpecificCategoryDetails";

export const useCategoryDetails = (categoryId) => {
    // console.log('Category Id',categoryId);
    
    return useQuery({
        queryKey: ["category-details", categoryId],
        queryFn: () => fetchCategoryWithLectures(categoryId),
        enabled: !!categoryId,
        // staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
