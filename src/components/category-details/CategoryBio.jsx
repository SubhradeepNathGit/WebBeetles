import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { specificCategory } from "../../redux/slice/specificCategorySlice";
import { motion } from "framer-motion";
import getSweetAlert from "../../util/sweetAlert";

const CategoryBio = ({ categoryName }) => {
    const dispatch = useDispatch(),
        { isSpecificCategoryLoading, getSpecificCategoryData, isSpecificCategoryError } =
            useSelector((state) => state.specificCategory);

    useEffect(() => {
        dispatch(specificCategory(categoryName))
            .then(() => { })
            .catch((err) => {
                getSweetAlert("Oops...", "Something went wrong!", "error");
                console.log("Error occurred", err);
            });
    }, [dispatch, categoryName]);

    return (
        <div className="bg-black">
            {/* Text Section */}
            <div className="py-10 sm:py-12 lg:py-16 gap-6 lg:gap-8 md:mx-30 mx-10">
                <div className="text-center">
                    <h2 className="text-2xl md:text-5xl lg:text-5xl font-bold text-purple-700 font-sans">
                        {getSpecificCategoryData.name}
                    </h2>
                </div>

                <div className="w-full text-center pt-5">
                    <p className="text-gray-400 text-base sm:text-lg leading-relaxed font-sans">
                        {getSpecificCategoryData.description}
                    </p>
                </div>
            </div>

            {/* Image Section */}
            <div className="relative md:pb-6 xl:mx-42 lg:mx-70 md:mx-50 mx-10 flex justify-center">
                {/* Main Image */}
                <motion.img
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src="/category-details/category-details-bio.png"
                    alt="Category Illustration"
                    className="w-[15rem] md:w-[22rem] lg:w-[28rem] xl:w-[60rem] object-contain"
                />

                {/* Animated Overlay Image */}
                <motion.img
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1, 1.02, 1],
                        y: [0, -6, 0],
                        opacity: 1,
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                    }}
                    whileHover={{ scale: 1.1 }}
                    src={`http://localhost:3005${getSpecificCategoryData.categoryImage}`}
                    alt="Overlay Illustration"
                    className="absolute md:bottom-6 bottom-1 xl:right-16 md:right-6 right-2 
          w-15 md:w-23 lg:w-30 xl:w-70 rounded-full shadow-lg object-cover border-4 border-white/10"
                />
            </div>
        </div>
    );
};

export default CategoryBio;