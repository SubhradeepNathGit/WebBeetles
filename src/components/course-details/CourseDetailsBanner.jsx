import React from 'react'

const CourseDetailsBanner = () => {
    return (
        <div className='bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white min-h-screen flex items-center justify-center px-6 lg:px-16'>

            <section className="bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black text-white min-h-screen flex items-center justify-center px-6 lg:px-16">
                <div className="pt-16 sm:pt-18 lg:pt-20 pb-8 sm:pb-12 lg:pb-20 min-h-screen flex items-center">
                    <div className="max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-10">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            {/* Contact tag */}
                            {/* <span className="inline-flex items-center gap-2 border border-purple-500 px-4 py-1 rounded-full text-sm tracking-wide mb-6">
                                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                   COURSES DETAILS
                                </span> */}

                            {/* Heading */}
                            <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-6">
                                Your Journey to Becoming a {" "}
                                <span className="text-purple-500">Pro{" "}</span>
                                Starts Here
                            </h1>

                            {/* <div className="flex gap-2 bg-gray-900 rounded-full p-2 w-max shadow-lg">
                    <button className="px-6 py-2 rounded-full text-white">
                        Home
                    </button>
                    <button className="px-6 py-2 rounded-full bg-purple-600 text-white shadow-md">
                        Contact Us
                    </button>
                </div> */}
                        </div>

                        {/* Right Image */}
                        <div className="flex-1">
                            <div className="rounded-[40px] overflow-hidden">
                                <img src="/images/course-details.png"
                                    alt="Happy Learner" className="w-72 sm:w-96 lg:w-[28rem] xl:w-[32rem] object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CourseDetailsBanner