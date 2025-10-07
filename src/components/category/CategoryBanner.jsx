import React from 'react'

const CategoryBanner = () => {
    return (
        <section className="bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white min-h-screen flex items-center justify-center px-6 lg:px-16">
            <div className="pt-16 sm:pt-18 lg:pt-20 pb-8 sm:pb-12 lg:pb-20 min-h-screen flex items-center">
                <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-10">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* Category tag */}
                        {/* <div className="inline-flex items-center border border-purple-400 rounded-full px-4 py-1 mb-6">
            <span className="text-sm font-medium text-purple-300">●</span>
            <span className="ml-2 text-sm font-medium tracking-wide">COURSES</span>
          </div> */}

                        {/* Heading */}
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                            Choose your interest and{" "}
                            <span className="text-purple-400">start learning</span>{" "}
                            what matters most.
                        </h1>
                    </div>

                    {/* Right Image */}
                    <div className="flex-1">
                        <div className="rounded-[40px] overflow-hidden">
                            <img src="/images/Subtract-img2.png"
                                alt="Happy Learner" className="w-72 sm:w-96 lg:w-[28rem] xl:w-[32rem] object-contain" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategoryBanner