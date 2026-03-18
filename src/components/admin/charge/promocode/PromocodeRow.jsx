import React from 'react'
import { Pencil, Trash2 } from "lucide-react";

const PromocodeRow = ({ promocode, togglePromo, openEdit, setOpenMarkModal, setChargeId, setType }) => {

    const percentUsed = Math.min((promocode?.uses / promocode?.max) * 100, 100);

    return (
        <div className="flex items-center justify-between bg-black border border-white/10 rounded-lg px-4 py-3 hover:border-white/20 transition w-full">

            {/* Info */}
            <div className="flex flex-col">


                <div className="flex items-center gap-2">
                    <code className="text-yellow-400 text-sm font-semibold tracking-widest">
                        {promocode?.name}
                    </code>

                    <span
                        className={`text-[10px] px-2 py-[2px] mb-1 rounded-full font-medium
            ${promocode?.status ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {promocode?.status ? "Active" : "Inactive"}
                    </span>
                    <span
                        className="text-[10px] px-2 py-[2px] mb-1 rounded-full font-medium bg-purple-500/10 text-purple-400">
                        {promocode?.apply_mode?.split("_")?.map(promo => promo?.charAt(0)?.toUpperCase() + promo?.slice(1)?.toLowerCase())?.join(" ")}
                    </span>
                </div>

                <p className="text-xs text-gray-400">
                    {promocode?.discount_amount}% OFF
                </p>
            </div>

            {/* Progress */}
            {/* <div className="flex-1 mx-6 hidden sm:block">
                <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${percentUsed}%` }}
                    />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                    {p.uses}/{p.max} uses
                </p>
            </div> */}
            <div className='flex'>
                {/* Toggle */}
                <button onClick={() => togglePromo(promocode?.id, !promocode?.status)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition mt-1 cursor-pointer
          ${promocode?.status ? "bg-green-500" : "bg-gray-600"}`}>

                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition
            ${promocode?.status ? "translate-x-5" : "translate-x-1"}`} />
                </button>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-4">

                    <button onClick={() => openEdit(promocode)}
                        className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
                    >
                        <Pencil size={16} className="text-blue-400" />
                    </button>

                    <button onClick={() => { setOpenMarkModal(true); setChargeId(promocode?.id); setType('promocode') }}
                        className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
                    >
                        <Trash2 size={16} className="text-red-400" />
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PromocodeRow;