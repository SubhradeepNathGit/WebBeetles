import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import EmptyCart from '../../../components/student/cart/EmptyCart';
import CartHeaderWithAction from '../../../components/student/cart/CartHeaderWithAction';
import CartItemCard from '../../../components/student/cart/CartItemCard';
import ImportantNotes from '../../../components/student/cart/ImportantNotes';
import PaymentSummaryCard from '../../../components/student/cart/PaymentSummaryCard';
import SecurityTrust from '../../../components/student/cart/SecurityTrust';
import TrustBadage from '../../../components/student/cart/TrustBadage';
import SupportCard from '../../../components/student/cart/SupportCard';
import SupportModal from '../../../components/student/cart/SupportModal';
import { useDispatch, useSelector } from 'react-redux';
import { checkLoggedInUser } from '../../../redux/slice/authSlice/checkUserAuthSlice';
import getSweetAlert from '../../../util/alert/sweetAlert';
import { fetchCartItems, getOrCreateCart } from '../../../redux/slice/cartSlice';
import { fetchCharges } from '../../../redux/slice/chargesSlice';
import { fetchCodes } from '../../../redux/slice/promocodeSlice';
import { useNavigate } from 'react-router-dom';


const Cart = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [discount, setDiscount] = useState(0);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const { isuserLoading, userAuthData, userError } = useSelector(state => state.checkAuth);
  const { isCartLoading, cartItems, currentCart, hasCartError } = useSelector(state => state.cart);
  const { isChargesLoading, allCharges, hasChargesError } = useSelector(state => state?.charge);
  const { isCodeLoading, allCode: promoCodes, hasCodesError } = useSelector(state => state?.promocode);

  // Calculate totals
  let tax = 0;
  const subtotal = cartItems?.reduce((sum, item) => sum + parseInt(item?.courses?.price), 0);
  const discountAmount = Math.round(subtotal * (discount / 100));
  allCharges?.forEach(charge => {
    tax += Math?.round((subtotal - discountAmount) * (Number.parseInt(charge?.percentage)) / 100);
  })
  const total = subtotal - discountAmount + tax;

  const navigateBack = () => {
    navigate('/course');
  };

  // Removed redundant checkLoggedInUser dispatch as ProtectedRoute handles it

  useEffect(() => {
    dispatch(getOrCreateCart(userAuthData?.id))
      .then(res => {
        // console.log('Response for getting cart details for specific user', res);

        dispatch(fetchCartItems(res?.payload?.id))
          .then(res => {
            // console.log('Response for fetching cart items', res);
          })
          .catch(err => {
            console.log('Error occured', err);
            getSweetAlert('Oops...', 'Something went wrong!', 'error');
          })
      })
      .catch(err => {
        console.log(err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, [userAuthData?.id, dispatch]);

  useEffect(() => {
    dispatch(fetchCharges({ status: true }))
      .then(res => {
        // console.log('Response for fetching all charges for course', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  useEffect(() => {
    dispatch(fetchCodes({ status: true }))
      .then(res => {
        // console.log('Response for fetching all codes', res);
      })
      .catch(err => {
        console.log('Error occured', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }, []);

  // console.log('Available cart items', cartItems);
  // console.log('Available promocode', promoCodes);
  // console.log('Available charges', allCharges);

  return (
    <div className="min-h-screen bg-black">

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 max-w-7xl">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateBack()}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back
            </button>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-white/60" />
              <h1 className="text-xl font-semibold text-white">Shopping Cart</h1>
              {cartItems?.length > 0 && (
                <span className="bg-white/10 text-white/70 text-xs font-medium px-2 py-0.5 rounded-full">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
          </div>
        </div>
        {(isCartLoading || isChargesLoading || isCodeLoading) ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
              <p className="text-white/60 font-medium">Loading cart details...</p>
            </div>
          </div>
        ) : cartItems?.length === 0 ? (
          // Empty Cart - Professional
          <EmptyCart navigateBack={navigateBack} />
        ) : (
          // Cart with Items - Production Ready
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header with Actions */}
              <CartHeaderWithAction cartItems={cartItems} cartId={currentCart?.id} />

              {/* Cart Items */}
              <AnimatePresence mode="popLayout">
                {cartItems?.map((item, index) => (
                  <CartItemCard key={item.id} item={item} index={index} cartId={currentCart?.id} />
                ))}
              </AnimatePresence>

              {/* Important Notes */}
              <ImportantNotes />
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-5">
                {/* Main Summary Card */}
                <PaymentSummaryCard cartId={currentCart?.id} cartItems={cartItems} userAuthData={userAuthData} allCharges={allCharges} promoCodes={promoCodes} subtotal={subtotal} tax={tax} total={total} discountAmount={discountAmount} discount={discount} setDiscount={setDiscount} />

                {/* Security & Trust */}
                <SecurityTrust />

                {/* Support Card */}
                <SupportCard setShowSupportModal={setShowSupportModal} />

                {/* Trust Badge */}
                <TrustBadage />

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support Modal */}
      {showSupportModal && (
        <SupportModal setShowSupportModal={setShowSupportModal} />
      )}

      <style>{`
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
};

export default Cart;