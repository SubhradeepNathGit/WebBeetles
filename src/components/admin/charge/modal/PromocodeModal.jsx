import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const PromocodeModal = ({ isOpen, onClose, editData, onSave, isCodeLoading }) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            discount_amount: "",
            apply_mode: "first_time"
        }
    });

    useEffect(() => {
        if (editData) {
            reset(editData);
        } else {
            reset({
                name: "",
                discount_amount: "",
                apply_mode: "first_time"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]">

            <div className="bg-[#0d0d0d] border border-white/10 rounded-xl w-[420px] p-6">

                {/* Header */}
                <div className="flex justify-between mb-5">
                    <h3 className="text-white text-sm font-semibold">
                        {editData ? "Update Promocode" : "Add Promocode"}
                    </h3>

                    <button onClick={onClose} className="cursor-pointer">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit(submitForm)}
                    className="space-y-4"
                >

                    {/* Promo Code */}
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            Promo Code
                        </label>

                        <input
                            {...register("name", {
                                required: "Promo code is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters required"
                                }
                            })}
                            placeholder="e.g. SALE30"
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white text-sm uppercase"
                        />

                        {errors.name && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>


                    {/* Discount Amount */}
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            Discount Amount
                        </label>

                        <input
                            type="number"
                            {...register("discount_amount", {
                                required: "Discount amount is required",
                                min: {
                                    value: 1,
                                    message: "Must be greater than 1"
                                },
                                max: {
                                    value: 100,
                                    message: "Cannot exceed 100%"
                                }
                            })}
                            placeholder="Enter discount"
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white text-sm"
                        />

                        {errors.discount_amount && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.discount_amount.message}
                            </p>
                        )}
                    </div>


                    {/* Apply Mode */}
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            Apply Mode
                        </label>

                        <select
                            {...register("apply_mode", {
                                required: "Select apply mode"
                            })}
                            className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white text-sm"
                        >
                            <option value="first_time">First Time</option>
                            <option value="always">Always</option>
                        </select>

                        {errors.apply_mode && (
                            <p className="text-red-400 text-xs mt-1">
                                {errors.apply_mode.message}
                            </p>
                        )}
                    </div>


                    {/* Submit Button */}
                    <button type="submit" disabled={isCodeLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded text-white text-sm font-medium transition cursor-pointer"
                    >
                        {isCodeLoading ? "Saving..." : editData ? "Update Promocode" : "Add Promocode"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default PromocodeModal;