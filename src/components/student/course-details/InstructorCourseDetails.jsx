import React, { useEffect } from 'react';
import { HiArrowRight } from "react-icons/hi";
import { RiBookOpenLine } from "react-icons/ri";
import { MdCurrencyRupee } from "react-icons/md";
import { checkLoggedInUser } from '../../../redux/slice/authSlice/checkUserAuthSlice';
import { FaRegClock, FaMobileAlt, FaCertificate } from "react-icons/fa";
import loaderAnimation from '../../../assets/animations/loader.json';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import ReviewCourse from './ReviewCourse';
import { Info, Loader2 } from 'lucide-react';
import Lottie from "lottie-react";
import { fetchUserPurchase } from '../../../redux/slice/purchaseSlice';
import hotToast from '../../../util/alert/hot-toast';
import { addCartItem, getOrCreateCart } from '../../../redux/slice/cartSlice';

const InstructorCourseDetails = ({ courseData: getSpecificCourseData }) => {
    const dispatch = useDispatch(),
        navigate = useNavigate(),
        { userAuthData } = useSelector(state => state.checkAuth),
        { currentCart, cartItems, isCartLoading, isCartAddLoading, hasCartError } = useSelector(state => state.cart),
        { isPurchaseLoading, getPurchaseData, hasPurchaseError } = useSelector(state => state.purchase);

    useEffect(() => {
        dispatch(checkLoggedInUser()).catch(err => {
            console.error("Error occurred", err);
            getSweetAlert("Error", "Something went wrong.", "error");
        });
    }, []);

    useEffect(() => {
        if (userAuthData) {
            dispatch(fetchUserPurchase({ userId: userAuthData?.id, status: 'paid' }))
                .then(res => {
                    // console.log('Response for fetching user profile', res);
                })
                .catch((err) => {
                    console.log("Error occurred", err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                });
        }
    }, [userAuthData]);

    const purchasedCourse = getPurchaseData?.filter(order => order.payment_status === "paid")
        ?.flatMap(order => order.purchase_items.map(item => item.course_id));

    // Handle add to cart 
    const addToCart = async (course) => {

        if (purchasedCourse?.includes(course?.id)) {
            hotToast("Course already purchased", "info", <Info className='text-orange-600' />);
            return;
        }
        else {
            if (!course) return;

            dispatch(getOrCreateCart(userAuthData?.id))
                .then(res => {
                    // console.log('Response for getting cart details for specific user', res);

                    dispatch(addCartItem({ cartId: res?.payload?.id, courseId: course?.id }))
                        .then(res => {
                            // console.log('Response for adding new product', res);

                            if (res.meta.requestStatus === "fulfilled") {
                                hotToast(`Course added to cart`, "success");
                            }
                            else if (res?.payload == 'duplicate key value violates unique constraint "cart_items_cart_id_course_id_key"') {
                                hotToast(`Course already added in cart`, "info", <Info className='text-orange-400' />);
                            }
                            else {
                                getSweetAlert("Error", "Update failed", "error");
                            }
                        })
                        .catch(err => {
                            // console.log('Error occured', err);
                            getSweetAlert('Oops...', 'Something went wrong!', 'error');
                        })
                })
                .catch(err => {
                    // console.log(err);
                    getSweetAlert('Oops...', 'Something went wrong!', 'error');
                })
        }
    };

    // console.log('Purchased data', getPurchaseData);

    return (
        <div className="bg-black p-6 rounded-3xl shadow-lg text-white">
            {!getSpecificCourseData?.instructor ? (
                <div className="flex justify-center items-center min-h-[70vh]">
                    <Lottie
                        animationData={loaderAnimation}
                        loop={true}
                        className="w-40 h-40 sm:w-52 sm:h-52" />
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-4">Instructor</h3>
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src={getSpecificCourseData?.instructor?.profile_image_url}
                            alt="Instructor"
                            className="w-12 h-12 rounded-full"
                        />
                        <div>
                            <p className="font-semibold">{getSpecificCourseData?.instructor?.name ?? 'N/A'}</p>
                            <p className="text-sm text-gray-400">{(getSpecificCourseData.instructor.role?.charAt(0)?.toUpperCase() + getSpecificCourseData.instructor.role?.slice(1)?.toLowerCase()) ?? 'Instructor'}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3">This course includes:</h3>
                    <ul>
                        <li className="flex items-center gap-3 py-3">
                            <FaRegClock className="text-purple-500" />
                            54 Hours of Learn-Anywhere Videos
                        </li>
                        <li className="flex items-center gap-3 py-3">
                            <RiBookOpenLine className="text-purple-500" />
                            Lifetime Learning Access
                        </li>
                        <li className="flex items-center gap-3 py-3">
                            <FaMobileAlt className="text-purple-500" />
                            Compatible with All Devices
                        </li>
                        <li className="flex items-center gap-3 py-3">
                            <FaCertificate className="text-purple-500" />
                            Certified Learning Achievement
                        </li>
                    </ul>

                    <div className="flex flex-col items-start mt-3">
                        <p className="text-purple-500 text-2xl font-bold mb-4 flex items-center">
                            <MdCurrencyRupee className="inline mr-1" />
                            {getSpecificCourseData?.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                        </p>

                        <button disabled={isCartLoading}
                            type="button" onClick={() => {
                                if (userAuthData) addToCart(getSpecificCourseData);
                                else navigate('/signin');
                            }}
                            className={`flex mb-5 mt-1 items-center justify-center gap-2 w-full text-white backdrop-blur-md border 
                                    border-white/30 px-5 py-3 rounded-full transition ${isCartLoading ?
                                    'cursor-not-allowed bg-gray-500 border-gray-400 opacity-60 hover:bg-gray-500 hover:border-gray-400' :
                                    'cursor-pointer hover:bg-purple-800 hover:border-purple-600 hover:opacity-90 bg-purple-600'}`}>
                            {isCartLoading ? (
                                <Loader2 className='animate-spin w-4 h-4' />) : ''} Add To Cart <HiArrowRight className="text-lg" />
                        </button>
                    </div>
                </>
            )}
            <ReviewCourse getSpecificCourseData={getSpecificCourseData}/>
        </div>
    );
};

export default InstructorCourseDetails;
