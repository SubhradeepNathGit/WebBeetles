import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { specificCategory } from "../../redux/slice/specificCategorySlice";
import getSweetAlert from "../../util/sweetAlert";

const CategoryBio = ({ categoryName }) => {
    const dispatch = useDispatch();
    const {
        isSpecificCategoryLoading,
        getSpecificCategoryData,
        isSpecificCategoryError
    } = useSelector((state) => state.specificCategory);

    useEffect(() => {
        if (!categoryName) return;

        dispatch(specificCategory(categoryName))
            .unwrap()
            .catch((err) => {
                getSweetAlert("Oops...", "Something went wrong!", "error");
                console.error("Error fetching category:", err);
            });
    }, [dispatch, categoryName]);

    // Loading state
    if (isSpecificCategoryLoading) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center">
                <div className="text-purple-700 text-xl">Loading...</div>
            </div>
        );
    }

    // Error state
    if (isSpecificCategoryError) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center">
                <div className="text-red-500 text-xl">Failed to load category</div>
            </div>
        );
    }

    // No data state
    if (!getSpecificCategoryData || !getSpecificCategoryData.name) {
        return null;
    }

    const { name, description, categoryImage } = getSpecificCategoryData;

    return (
        <>
            <style>
                {`
                    @keyframes rotate-clockwise {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                    .rotate-animation {
                        animation: rotate-clockwise 10s linear infinite;
                    }
                    .rotate-animation:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>
            <section className="bg-black" aria-labelledby="category-title">
                {/* Text Section */}
                <div className="py-8 sm:py-10 md:py-12 lg:py-16 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 max-w-7xl mx-auto">
                    <div className="text-center space-y-4 sm:space-y-5 md:space-y-6">
                        {/* Title */}
                        <h1
                            id="category-title"
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-purple-700 font-sans leading-tight px-2"
                        >
                            {name}
                        </h1>

                        {/* Description */}
                        {description && (
                            <div className="w-full pt-2 sm:pt-3 md:pt-4">
                                <p className="text-gray-400 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-sans max-w-4xl mx-auto px-2">
                                    {description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Two Column Layout - Image & Content */}
                <div className="pb-8 sm:pb-10 md:pb-12 lg:pb-16 px-4 sm:px-6 md:px-10 lg:px-16 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Column - Image Section */}
                        <div className="relative flex justify-center items-center order-2 lg:order-1">
                            {/* Main Background Image */}
                            <img
                                src="/category-details/category-details-bio.png"
                                alt="Category illustration background"
                                className="w-full max-w-[18rem] sm:max-w-[24rem] md:max-w-[32rem] lg:max-w-full h-auto object-contain"
                                loading="lazy"
                            />

                            {/* Category Image Overlay */}
                            {categoryImage && (
                                <img
                                    src={`http://localhost:3005${getSpecificCategoryData.categoryImage}`}
                                    alt={`${name} category`}
                                    className="rotate-animation absolute
                                        bottom-0 right-0
                                        sm:bottom-2 sm:right-2
                                        md:bottom-4 md:right-4
                                        lg:bottom-0 lg:right-2
                                        w-16 h-16
                                        sm:w-20 sm:h-20
                                        md:w-28 md:h-28
                                        lg:w-36 lg:h-36
                                        xl:w-40 xl:h-40
                                        rounded-full shadow-2xl object-cover 
                                        border-2 sm:border-3 md:border-4 border-white/10
                                        transition-transform duration-300 hover:scale-105 hover:shadow-purple-500/50"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        console.error('Failed to load category image');
                                    }}
                                />
                            )}
                        </div>

                        {/* Right Column - Content Section */}
                        <div className="space-y-6 order-1 lg:order-2">
                            <div className="space-y-4">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                    What We Offer
                                </h2>
                                <p className="text-gray-400 text-sm sm:text-base md:text-lg leading-relaxed">
                                    Comprehensive learning paths designed to take you from beginner to professional. Our carefully curated course categories cover every aspect of modern technology and development.
                                </p>
                            </div>



                            <div className="space-y-4">
                                <h3 className="text-xl sm:text-2xl font-semibold text-purple-500">
                                    Career & Job Scope
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-3 hover:border-purple-500/50 transition-colors">
                                        <p className="text-white font-medium text-sm sm:text-base">High Demand Jobs</p>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Global opportunities</p>
                                    </div>
                                    <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-3 hover:border-purple-500/50 transition-colors">
                                        <p className="text-white font-medium text-sm sm:text-base">Remote Work</p>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Work from anywhere</p>
                                    </div>
                                    <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-3 hover:border-purple-500/50 transition-colors">
                                        <p className="text-white font-medium text-sm sm:text-base">Competitive Salary</p>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">₹6L - ₹25L+ per annum</p>

                                    </div>
                                    <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-3 hover:border-purple-500/50 transition-colors">
                                        <p className="text-white font-medium text-sm sm:text-base">Career Growth</p>
                                        <p className="text-gray-400 text-xs sm:text-sm mt-1">Continuous advancement</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                    Our courses prepare you for real-world challenges with hands-on projects, industry-relevant curriculum, and expert mentorship. Start learning today and unlock your potential in the tech industry with skills that employers actively seek.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CategoryBio;