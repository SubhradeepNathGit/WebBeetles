import React from 'react'
import CategoryDetailsBanner from '../../components/student/category-details/CategoryDetailsBanner'
import CategoryBio from '../../components/student/category-details/CategoryBio'
import RelatedCourse from '../../components/student/category-details/RelatedCourse'
import { useParams } from 'react-router-dom'
import Lottie from "lottie-react";
import loaderAnimation from "./../../assets/animations/loader.json"
import { decodeBase64Url } from '../../util/encodeDecode/base64'
import { useCategoryDetails } from '../../tanstack/query/fetchSpecificCategoryDetails'

const CategoryDetails = () => {
    const { categoryId } = useParams();
    const category_id = decodeBase64Url(categoryId);

    const { isLoading, data: categoryDetails, error } = useCategoryDetails(category_id);
    console.log(categoryDetails)

    return (
        <>
            <CategoryDetailsBanner />
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[70vh]">
                    <Lottie
                        animationData={loaderAnimation}
                        loop={true}
                        className="w-40 h-40 sm:w-52 sm:h-52"
                    />
                </div>
            ) : (
                <>
                    <CategoryBio categoryDetails={categoryDetails} />
                    <RelatedCourse categoryDetails={categoryDetails} />
                </>
            )}
        </>
    )
}

export default CategoryDetails