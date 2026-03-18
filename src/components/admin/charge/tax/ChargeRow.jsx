import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const ChargeRow = ({ charge, toggleCharge, openEdit, setOpenMarkModal, setChargeId, setType }) => {

    return (
        <div className="flex items-center justify-between bg-black border border-white/10 rounded-lg px-4 py-3 hover:border-white/20 transition w-full">

            {/* Charge Info */}
            <div className="flex flex-col">

                <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium"> {charge?.charge_type ?? "N/A"} </p>

                    <span
                        className={`text-[10px] px-2 py-[2px] mb-1 rounded-full font-medium
            ${charge?.status ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                        {charge?.status ? "Active" : "Inactive"}
                    </span>
                </div>

                <p className="text-xs text-gray-400">{charge?.percentage ?? 0}% </p>

            </div>

            {/* Status Toggle */}
            <div className="flex items-center gap-4">
                <button onClick={() => { toggleCharge(charge?.id, !charge?.status); }}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition 
            ${charge.status ? "bg-green-500" : "bg-gray-600"}`}
                >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition cursor-pointer
              ${charge.status ? "translate-x-5" : "translate-x-1"}`} />
                </button>

                {/* Edit */}
                <button onClick={() => openEdit(charge)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition cursor-pointer" >
                    <Pencil size={16} className="text-blue-400" />
                </button>

                {/* Delete */}
                <button onClick={() => { setOpenMarkModal(true); setChargeId(charge?.id); setType('charge') }}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition cursor-pointer">
                    <Trash2 size={16} className="text-red-400" />
                </button>
            </div>
        </div>
    );
};

export default ChargeRow;