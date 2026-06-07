import React from 'react'
import { useDispatch } from 'react-redux';
import { deleteCart } from '../../../redux/slice/cartSlice';
import hotToast from '../../../util/alert/hot-toast';
import getSweetAlert from '../../../util/alert/sweetAlert';

const CartHeaderWithAction = ({ cartItems, cartId }) => {
    const dispatch = useDispatch();

    const handleClearCart = () => {
        dispatch(deleteCart(cartId))
            .then(res => {
                hotToast(`All course removed from cart`, "success");
            })
            .catch(err => {
                console.log('Error occured', err);
                getSweetAlert('Oops...', 'Something went wrong!', 'error');
            })
    };

    return (
        <div className="bg-[#111] rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Your Selected Courses
                    </h2>
                    <p className="text-sm text-white/50 mt-1">
                        {cartItems?.length} {cartItems?.length === 1 ? 'item' : 'items'} • Review before checkout
                    </p>
                </div>
                {cartItems.length > 1 && (
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-red-400 hover:text-red-300 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10 cursor-pointer"
                    >
                        Clear All
                    </button>
                )}
            </div>
        </div>
    )
}

export default CartHeaderWithAction