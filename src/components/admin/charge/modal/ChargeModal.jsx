import { Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const ChargeModal = ({ isOpen, onClose, onSave, editData, isChargesLoading }) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (editData) {
            reset({
                charge_type: editData.charge_type,
                percentage: editData.percentage
            });
        } else {
            reset({
                charge_type: "",
                percentage: ""
            });
        }
    }, [editData, reset]);

    const submitForm = (data) => {
        onSave(data);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-[#0d0d0d] border border-white/10 rounded-xl w-[420px] p-6 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-sm font-semibold">
                        {editData ? "Update Charge" : "Add New Charge"}
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(submitForm)} className="space-y-5">

                    {/* Charge Type */}
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            Charge Type
                        </label>

                        <input
                            type="text"
                            placeholder="GST / Platform Fee"
                            {...register("charge_type", {
                                required: "Charge type is required"
                            })}
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                        />

                        {errors.charge_type && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.charge_type.message}
                            </p>
                        )}
                    </div>

                    {/* Percentage */}
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            Percentage (%)
                        </label>

                        <input
                            type="number"
                            placeholder="Enter percentage"
                            {...register("percentage", {
                                required: "Percentage is required",
                                min: {
                                    value: 0,
                                    message: "Must be greater than 0"
                                },
                                max: {
                                    value: 100,
                                    message: "Cannot exceed 100%"
                                }
                            })}
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                        />

                        {errors.percentage && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.percentage.message}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-3">

                        <button
                            type="button" disabled={isChargesLoading} onClick={onClose}
                            className={`px-4 py-2 text-sm border border-white/10 rounded text-gray-300 hover:bg-white/10 ${isChargesLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit" disabled={isChargesLoading}
                            className={`px-4 py-2 text-sm text-white rounded ${isChargesLoading ? 'cursor-not-allowed bg-purple-700' : 'cursor-pointer bg-purple-600 hover:bg-purple-700'}`}
                        >
                            {isChargesLoading && <Loader2 className="inline animate-spin w-4 h-4 mb-1 mr-1" />}
                            {editData ? "Update Charge" : "Add Charge"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default ChargeModal;