import React, { useState, useRef } from 'react';
import { ArrowRight, Lock, Package, Tag, CheckCircle, X, Info, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { useNavigate } from 'react-router-dom';
import { deleteCart } from '../../../redux/slice/cartSlice';
import { updateCoursePurchaseStatus } from '../../../redux/slice/studentSlice';
import { loadRazorpay } from '../../../util/razorpay/razorpayLoader';
import { useDispatch } from 'react-redux';
import { addActivityRequest } from '../../../redux/slice/activitySlice';
import supabase from '../../../util/supabase/supabase';

const PaymentSummaryCard = ({
    cartId, cartItems, userAuthData, allCharges, promoCodes, subtotal, tax, total, discountAmount, discount, setDiscount }) => {

    const [promoCode, setPromoCode] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [promoApplied, setPromoApplied] = useState(false);
    const [paymentLoad, setPaymentLoad] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const razorpayRef = useRef(null);

    const CREATE_ORDER_URL = import.meta.env.VITE_CREATE_ORDER_URL;
    const VERIFY_PAYMENT_URL = import.meta.env.VITE_VERIFY_PAYMENT_URL;
    const CANCEL_PAYMENT_URL = import.meta.env.VITE_CANCEL_PAYMENT_URL;

    const handleApplyPromo = () => {
        const code = promoCode.toUpperCase();
        const promo = promoCodes?.find(p => p.name === code);

        if (!promo) return hotToast('Oops! Invalid promocode.', 'info', <Info className="text-orange-600" />);

        if ((promo.apply_mode === 'first_time' && !userAuthData?.course_purchased) || promo.apply_mode === 'always') {
            setDiscount(promo.discount_amount);
            setPromoApplied(true);
            hotToast('Congrats! Promocode added.', 'success');
        } else {
            hotToast('Oops! Promocode not applicable.', 'error');
        }
    };

    const handleRemovePromo = () => {
        setPromoCode('');
        setDiscount(0);
        setPromoApplied(false);
    };

    const getFreshToken = async () => {
        // Strategy 1: getSession (cached but auto-refreshes if expired)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) return session.access_token;

        // Strategy 2: Force refresh if no valid session
        const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
        if (refreshedSession?.access_token) return refreshedSession.access_token;

        // Strategy 3: Fallback to sessionStorage (legacy)
        return sessionStorage.getItem('student_token');
    };

    const verifyPayment = async (razorpayResponse) => {
        try {
            const token = await getFreshToken();

            const res = await fetch(VERIFY_PAYMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    ...razorpayResponse,
                    items: cartItems.map(item => ({ course_id: item.course_id, price: item.courses?.price || item.price })),
                }),
            });

            if (!res.ok) throw new Error("Payment verification failed");

            await dispatch(deleteCart(cartId));
            await dispatch(updateCoursePurchaseStatus({ id: userAuthData.id }));

            for (const item of cartItems) {
                await dispatch(addActivityRequest({
                    activity: {
                        course_id: item.course_id,
                        instructor_id: item.courses.instructor_id,
                        student_id: userAuthData.id,
                        title: "New Enrollment",
                        message: `A student enrolled in ${item.courses.title}`,
                        status: "success",
                        viewer_type: "all"
                    }
                }));
            }

            navigate("/student/dashboard");
        } catch (err) {
            getSweetAlert("Error", "Something went wrong during payment verification", "error");
        }
    };

    const openRazorpay = (orderData) => {
        setPaymentLoad(false);

        if (!window.Razorpay) return;

        const rzp = new window.Razorpay({
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.orderId,
            name: "WebBeetles",
            description: "Course Purchase",
            theme: { color: "#7C3AED" },

            handler: (response) => {
                razorpayRef.current = null;
                verifyPayment({ ...response, purchaseId: orderData.purchaseId });
            },

            modal: {
                ondismiss: async () => {
                    razorpayRef.current = null;
                    const cancelToken = await getFreshToken();

                    await fetch(CANCEL_PAYMENT_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${cancelToken}`,
                            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                        },
                        body: JSON.stringify({
                            purchaseId: orderData.purchaseId,
                        }),
                    })
                }
            }
        });

        rzp.on("payment.failed", async (response) => {
            const failToken = await getFreshToken();
            await fetch(CANCEL_PAYMENT_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${failToken}`,
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    purchaseId: orderData.purchaseId,
                }),
            });
        });

        razorpayRef.current = rzp;
        rzp.open();
    };

    const numericTotal = Number(total);

    const handlePayment = async () => {
        try {
            const token = await getFreshToken();

            if (!token) {
                getSweetAlert('Oops!', "Session expired. Please sign in again.", 'warning');
                navigate('/signin');
                return;
            }

            // Update sessionStorage with the fresh token
            sessionStorage.setItem('student_token', token);

            if (!numericTotal || Number.isNaN(numericTotal)) {
                getSweetAlert('Oops!', "Invalid total amount. Please refresh the page.", 'warning');
                return;
            }

            await loadRazorpay();

            const res = await fetch(CREATE_ORDER_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    total: numericTotal,
                    cartItems,
                }),
            });

            if (!res.ok) {
                setPaymentLoad(false);
                const text = await res.text();
                getSweetAlert('Oops!', "Order processing failed", 'error');
                return;
            }

            const orderData = await res.json();
            openRazorpay(orderData);

        } catch (err) {
            getSweetAlert('Oops!', "Payment service is currently unavailable. Please try again later.", 'warning');
        }
    };

    const handleProceedToBuy = () => {
        if (!agreeTerms) {
            getSweetAlert('Oops!', 'Please agree to the Terms & Conditions and Refund Policy to continue.', 'warning');
            return;
        }
        setPaymentLoad(true);

        if (numericTotal > 50000) {
            getSweetAlert("Limit exceeded", "Maximum payable amount is ₹50,000 per transaction", "info");
            return;
        }

        const hasInactiveCourse = cartItems?.some(item => item?.courses?.is_active !== true || item?.is_admin_block);
        if (hasInactiveCourse) {
            hotToast("Some items are unavailable right now. Please check", 'info', <Info className='text-orange-600' />);
            return;
        }

        handlePayment();
    };

    return (
        <div className="bg-[#111] rounded-xl shadow-lg p-6 border border-white/10">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Order Summary</h2>
                    <p className="text-xs text-white/50">Review your purchase</p>
                </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/70">
                    <span>Subtotal ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {promoApplied && (
                    <div className="flex justify-between text-purple-300 bg-purple-500/10 -mx-2 px-2 py-2 rounded-lg border border-purple-500/20">
                        <span className="flex items-center gap-2 font-medium">
                            <Tag className="w-4 h-4" /> Discount ({discount}%)
                        </span>
                        <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                )}

                {allCharges?.map(charge => (
                    <div key={charge?.id} className="flex justify-between text-white/60">
                        <span className="flex items-center gap-1">
                            {charge?.charge_type} ({charge?.percentage}%)
                            <Info className="w-3 h-3 text-white/30" />
                        </span>
                        <span className="font-semibold text-white/80">
                            ₹{Math.round((subtotal - discountAmount) * Number(charge?.percentage) / 100).toLocaleString('en-IN')}
                        </span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="bg-white/5 border border-white/10 -mx-6 px-6 py-5 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-white/50 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-white">₹{total.toLocaleString('en-IN')}</p>
                    </div>
                    {promoApplied && (
                        <div className="text-right">
                            <p className="text-xs text-purple-300 font-semibold bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/30">
                                Saved ₹{discountAmount.toLocaleString('en-IN')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Agree Terms */}
            <div className="mb-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 accent-purple-600 border-white/20 rounded"
                    />
                    <span className="text-xs text-white/50 leading-relaxed">
                        I agree to the{' '}
                        <a href="#" className="text-purple-400 font-semibold hover:underline hover:text-purple-300 transition-colors">Terms & Conditions</a> and{' '}
                        <a href="#" className="text-purple-400 font-semibold hover:underline hover:text-purple-300 transition-colors">Refund Policy</a>
                    </span>
                </label>
            </div>

            {/* Buy Button */}
            <motion.button
                whileHover={{ scale: agreeTerms ? 1.02 : 1 }}
                whileTap={{ scale: agreeTerms ? 0.98 : 1 }}
                onClick={handleProceedToBuy}
                disabled={!agreeTerms || paymentLoad}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-base mb-4 ${(agreeTerms)
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] cursor-pointer'
                    : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                    }`}
            >
                {!paymentLoad ? <Lock className="w-5 h-5" /> : <Loader2 className='animate-spin w-5 h-5' />}
                Buy Now — ₹{total.toLocaleString('en-IN')}
                <ArrowRight className="w-5 h-5" />
            </motion.button>

            {/* Payment Methods */}
            <div className="mb-4">
                <p className="text-xs text-white/40 font-semibold mb-2">Accepted Payment Methods</p>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs font-semibold text-white/50">
                        <CreditCard className="w-3 h-3 inline mr-1" />Cards
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs font-semibold text-white/50">
                        <Smartphone className="w-3 h-3 inline mr-1" />UPI
                    </div>
                </div>
            </div>

            {/* Promo Code */}
            <div className="pt-4 border-t border-white/10">
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-400" />
                    Have a promo code?
                </label>
                {!promoApplied ? (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 text-sm uppercase text-white placeholder:text-white/30"
                        />
                        <button
                            onClick={handleApplyPromo}
                            disabled={!promoCode.trim()}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer
                            ${promoCode.trim() ? "bg-purple-600 text-white hover:bg-purple-500" : "bg-white/5 text-white/30 cursor-not-allowed"}`}
                        >
                            Apply
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-purple-400" />
                            <span className="text-sm font-bold text-purple-300">{promoCode} Applied!</span>
                        </div>
                        <button onClick={handleRemovePromo} className="text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <p className="text-xs text-white/30 mt-2">
                    Try: {promoCodes?.map((code, index) => (
                        <span key={index}>{code?.name}{promoCodes?.length > index + 1 ? ',' : ''} </span>
                    ))}
                </p>
            </div>
        </div>
    );
};

export default PaymentSummaryCard;
