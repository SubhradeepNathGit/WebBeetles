import React from 'react'
import CategoryDetailsBanner from '../components/category-details/CategoryDetailsBanner'
import CategoryBio from '../components/category-details/CategoryBio'
import RelatedCourse from '../components/category-details/RelatedCourse'
import { useParams } from 'react-router-dom'

const CategoryDetails = () => {
    const { categoryName } = useParams();
    // console.log('Category Name', categoryName);

    return (
        <>
            <CategoryDetailsBanner />
            <CategoryBio categoryName={categoryName} />
            <RelatedCourse categoryName={categoryName} />
        </>
    )
}

export default CategoryDetails