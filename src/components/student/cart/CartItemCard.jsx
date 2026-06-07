import React from 'react'
import { Award, Calendar, CheckCircle, Shield, Trash2, Video } from 'lucide-react'
import { motion } from 'framer-motion';
import { formatDateDDMMYY } from '../../../util/dateFormat/dateFormat';
import { removeCartItem } from '../../../redux/slice/cartSlice';
import { useDispatch } from 'react-redux';
import getSweetAlert from '../../../util/alert/sweetAlert';
import hotToast from '../../../util/alert/hot-toast';
import { useCategoryDetails } from '../../../tanstack/query/fetchSpecificCategoryDetails';
import { useCourseVideos } from '../../../tanstack/query/fetchLectureVideo';

const CartItemCard = ({ item, index, cartId }) => {

    const isInactive = item?.is_active == true && item?.is_admin_block == false;
    const { isLoading: categoryLoading, data: categoryData, error: hasCategoryError } = useCategoryDetails(item?.courses?.category_id);
    const { isLoading: courseLoading, data: courseData, error: hasCourseError } = useCourseVideos({ courseId: item?.course_id });
    const dispatch = useDispatch();

    const handleRemoveFromCart = (courseId) => {
        dispatch(removeCartItem({ cartId, courseId }))
            .then(res => {
                hotToast(`Course removed from cart`, "success");
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    return (
        <motion.div layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative bg-[#111] rounded-xl transition-all p-5 sm:p-6 border border-white/10 group
            ${isInactive ? "opacity-50 grayscale" : "hover:border-white/20"} `}>

            <div className="flex flex-col sm:flex-row gap-5">
                {/* Image */}
                <div className="relative w-full sm:w-44 h-52 sm:h-36 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                        src={item?.courses?.thumbnail}
                        alt={item?.courses?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-lg">
                        Item {index + 1}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg">
                        {categoryData?.name ?? 'N/A'}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                                {item?.courses?.title ?? 'N/A'}
                            </h3>
                            <p className="text-sm text-white/50 line-clamp-2 mb-3">
                                {item?.courses?.description ?? 'N/A'}
                            </p>
                        </div>
                        <button
                            onClick={() => handleRemoveFromCart(item?.course_id)}
                            className="pointer-events-auto filter-none z-20 relative flex-shrink-0 w-10 h-10 rounded-lg bg-red-500/10 text-red-400
                                hover:bg-red-500/20 hover:text-red-300 transition-all flex items-center justify-center cursor-pointer border border-red-500/20"
                            title="Remove from cart">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-4">
                        <div className="flex flex-wrap gap-2">
                            {item?.courses?.feature?.map((feature, idx) => (
                                <span key={idx} className="text-xs bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded-md font-medium border border-purple-500/20">
                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                    {feature}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-white/40">
                            <span className="flex items-center gap-1.5">
                                <Video className="w-4 h-4" />
                                {courseData?.length ?? 0} session{courseData?.length > 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Award className="w-4 h-4" />
                                {item?.courses?.is_completed ? 'Completed' : 'Ongoing'}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatDateDDMMYY(new Date())}
                            </span>
                        </div>
                    </div>

                    {/* Price & Guarantee */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div>
                            <p className="text-xs text-white/40 mb-1">Course Fee</p>
                            <p className="text-3xl font-bold text-white">
                                ₹{parseInt(item?.courses?.price).toLocaleString('en-IN')}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 text-sm text-purple-300 bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/20">
                                <Shield className="w-4 h-4" />
                                <span className="font-semibold">Money-back Guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default CartItemCard