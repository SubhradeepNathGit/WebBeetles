import React from 'react'

const CategoryDetailsBanner = () => {
    return (
        <section className="bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white min-h-screen flex items-center justify-center px-6 lg:px-16">
            <div className="pt-16 sm:pt-18 lg:pt-20 pb-8 sm:pb-12 lg:pb-20 w-full">
                <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="flex-1 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-6">
                            Unlock Your{" "}
                            <span className="text-purple-500">Potential </span>
                            and expand Your Skills with{" "}
                            <span className="text-purple-500">Expert-Led </span>Category
                        </h1>
                    </div>

                    <div className="flex-1 flex justify-center">
                        <div className="rounded-[40px] overflow-hidden">
                            <img
                                src="/category-details/category-details.png"
                                alt="Happy Learner"
                                className="w-72 sm:w-96 lg:w-[28rem] xl:w-[32rem] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategoryDetailsBanner
