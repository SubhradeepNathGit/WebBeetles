import React from 'react'
import CategoryBanner from '../../components/student/category/CategoryBanner'
import CategoryList from '../../components/student/category/CategoryList'
import PreFooterCTA from '../../components/student/common/Prefooter'

const Category = () => {
    return (
        <>
            <CategoryBanner />
            <CategoryList />
            <PreFooterCTA />
        </>
    )
}

export default Category