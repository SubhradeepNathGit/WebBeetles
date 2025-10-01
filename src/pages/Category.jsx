import React from 'react'
import CategoryBanner from '../components/category/CategoryBanner'
import CategoryList from '../components/category/CategoryList'
import PreFooterCTA from '../components/prefooter'

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