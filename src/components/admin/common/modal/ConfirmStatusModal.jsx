import { Loader2 } from 'lucide-react';
import React from 'react';

const ConfirmStatusModal = ({ isLoading, setOpenMarkModal, title, subTitle, handleMark }) => {

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-150 p-4">
            <div className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-gray-800">
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-gray-400 mb-6">{subTitle} ?</p>
                <div className="flex gap-3">
                    <button disabled={isLoading} onClick={() => handleMark()} className={`flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        {isLoading && <Loader2 className='w-4 h-h inline mb-1 animate-spin' />} Confirm
                    </button>
                    <button disabled={isLoading} onClick={() => setOpenMarkModal(false)} className={`flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmStatusModal