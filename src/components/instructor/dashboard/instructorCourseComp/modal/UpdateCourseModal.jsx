import React, { useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateCourse } from '../../../../../redux/slice/couseSlice';
import hotToast from '../../../../../util/alert/hot-toast';
import getSweetAlert from '../../../../../util/alert/sweetAlert';

const UpdateCourseModal = ({ setShowEditModal, editForm, setEditForm }) => {

    const dispatch = useDispatch(),
        { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state.course),
        { register, control, handleSubmit, reset, formState: { errors } } = useForm({
            defaultValues: {
                title: '',
                revenue: '',
                status: 'draft',
                features: [{ value: '' }]
            }
        });

    const { fields: featureFields, append, remove } = useFieldArray({ control, name: 'features' });

    useEffect(() => {
        if (!editForm) return;

        reset({
            title: editForm.title || '',
            revenue: Number(editForm.price) || 0,
            status: editForm.is_active ? 'published' : 'draft',
            features: editForm.feature?.length ? editForm.feature.map(f => ({ value: f })) : [{ value: '' }]
        });
    }, [editForm, reset]);

    const onSubmit = (data) => {
        const updatedPayload = {
            ...editForm,
            title: data.title,
            price: data.revenue,
            is_active: data.status == 'published' ? true : false,
            feature: data.features.map(f => f.value)
        };
        console.log(updatedPayload);

        const { id, ...updatedData } = updatedPayload;

        dispatch(updateCourse({ id, data: updatedData }))
            .then(res => {
                // console.log('Response for updating course', res);

                if (res.meta.requestStatus === "fulfilled") {
                    setEditForm(null);
                    setShowEditModal(null);
                    hotToast('Course updated successfully!', "success");
                }
                else {
                    hotToast('Failed to update course. Try again.', "error");
                }
            })
            .catch(error => {
                console.error("Error while submitting course:", error);
                getSweetAlert("Error", 'Something went wrong while updating the course.', "error");
            })

    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full border border-gray-800 my-8">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold">Edit Course</h2>
                    <button
                        onClick={() => setShowEditModal(null)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* TITLE */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Course Title</label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                        {errors.title && (
                            <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* PRICE + STATUS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Price</label>
                            <input
                                type="number"
                                {...register('revenue', {
                                    required: 'Price is required',
                                    min: { value: 0, message: 'Price must be positive' }
                                })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                            {errors.revenue && (
                                <p className="text-red-400 text-sm mt-1">{errors.revenue.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <select
                                {...register('status', { required: true })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>

                    {/* FEATURES */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Course Features
                        </label>

                        <div className="space-y-3">
                            {featureFields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-2">
                                    <input
                                        {...register(`features.${index}.value`, {
                                            required: 'Feature is required'
                                        })}
                                        placeholder={`Feature ${index + 1}`}
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                                    />

                                    {index !== 0 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {featureFields.length < 6 && (
                                <button
                                    type="button"
                                    onClick={() => append({ value: '' })}
                                    className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer"
                                >
                                    + Add Feature
                                </button>
                            )}

                            {errors.features && (
                                <p className="text-red-400 text-sm mt-1">
                                    Feature fields are required
                                </p>
                            )}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                        >
                            {isCourseLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : ''} Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEditModal(null)}
                            className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default UpdateCourseModal;
