import React, { useState, useEffect } from 'react'
import { Code, Edit3, Loader2, Plus, Tag, Trash2, X } from 'lucide-react';
import hotToast from '../../../../util/alert/hot-toast';
import { useDispatch } from 'react-redux';
import { instructorRequest } from '../../../../redux/slice/instructorSlice';
import { setUserAuthData } from '../../../../redux/slice/authSlice/checkUserAuthSlice';

const InstructorExpertise = ({ instructorDetails }) => {

    const dispatch = useDispatch();
    const [expertise, setExpertise] = useState(instructorDetails?.expertise || []);
    const [editingExpertise, setEditingExpertise] = useState(false);
    const [updatingExpertise, setUpdatingExpertise] = useState(false);

    // Form-style input fields (same pattern as InstructorRequestForm)
    const [expertiseFields, setExpertiseFields] = useState([{ id: Date.now(), value: "" }]);

    // Sync from prop changes
    useEffect(() => {
        setExpertise(instructorDetails?.expertise || []);
    }, [instructorDetails?.expertise]);

    const addExpertiseField = () => {
        if (expertiseFields.length < 10) {
            setExpertiseFields([...expertiseFields, { id: Date.now(), value: "" }]);
        }
    };

    const removeExpertiseField = (id) => {
        if (expertiseFields.length > 1) {
            setExpertiseFields(expertiseFields.filter(f => f.id !== id));
        }
    };

    const updateExpertiseValue = (id, value) => {
        setExpertiseFields(expertiseFields.map(f => f.id === id ? { ...f, value } : f));
    };

    const handleEditClick = () => {
        // Pre-populate fields with existing expertise
        const fields = expertise.length > 0
            ? expertise.map((exp, i) => ({ id: Date.now() + i, value: exp }))
            : [{ id: Date.now(), value: "" }];
        setExpertiseFields(fields);
        setEditingExpertise(true);
    };

    const handleExpertiseSave = async () => {
        const cleanedExpertise = expertiseFields.map(f => f.value.trim()).filter(Boolean);

        if (cleanedExpertise.length === 0) {
            hotToast("Please add at least one expertise", "error");
            return;
        }

        setUpdatingExpertise(true);

        // Title-case
        const updatedExpertise = cleanedExpertise.map(exp =>
            exp.split(",").map(ex =>
                ex.split(" ").map(e =>
                    e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
                ).join(" ")
            ).join(",")
        );

        // Use the same instructorRequest thunk that the form uses (proven to work)
        const payload = {
            bio: instructorDetails?.bio,
            expertise: updatedExpertise,
            social_links: instructorDetails?.social_links,
            application_complete: true
        };

        try {
            const res = await dispatch(instructorRequest({ payload, id: instructorDetails?.id }));

            if (res.meta.requestStatus === "fulfilled") {
                setExpertise(res.payload?.expertise || []);
                setEditingExpertise(false);
                dispatch(setUserAuthData(res.payload));
                hotToast('Expertise updated successfully', "success");
            } else {
                hotToast('Something went wrong!', "error");
            }
        } catch (err) {
            console.error("[Expertise] Error:", err);
            hotToast("Something went wrong!", "error");
        } finally {
            setUpdatingExpertise(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/80 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-md">
                        <Code size={18} className="text-rose-400" />
                    </div>
                    Expertise
                </h2>
                {!editingExpertise && (
                    <button
                        onClick={handleEditClick}
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all duration-300 font-medium cursor-pointer"
                    >
                        <Edit3 size={12} /> Edit
                    </button>
                )}
            </div>

            {!editingExpertise ? (
                <div className="flex flex-wrap gap-2">
                    {expertise?.length > 0 ? expertise.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 bg-zinc-900/30 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-850 hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:text-white transition-colors duration-200 cursor-default">
                            <Tag size={11} className="text-rose-400/80" />{skill}
                        </span>
                    )) : <p className="text-zinc-500 text-xs sm:text-sm italic">No expertise added yet.</p>}
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Input fields — same pattern as InstructorRequestForm */}
                    {expertiseFields.map((field, idx) => (
                        <div key={field.id} className="flex gap-2">
                            <input
                                type="text"
                                placeholder={`e.g., ${idx === 0 ? 'Web Development' : idx === 1 ? 'UI/UX Design' : 'Machine Learning'}`}
                                value={field.value}
                                onChange={(e) => updateExpertiseValue(field.id, e.target.value)}
                                className="flex-1 bg-zinc-900/30 text-zinc-200 placeholder:text-zinc-600 rounded-xl px-3.5 py-2.5 text-xs border border-zinc-800 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all"
                            />
                            {expertiseFields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeExpertiseField(field.id)}
                                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/40 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add more button */}
                    {expertiseFields.length < 10 && (
                        <button
                            type="button"
                            onClick={addExpertiseField}
                            className="w-full py-2.5 rounded-xl bg-zinc-900/20 border border-dashed border-zinc-700 text-zinc-400 hover:bg-zinc-900/40 hover:border-zinc-600 hover:text-zinc-200 transition-all flex items-center justify-center gap-2 text-xs font-medium cursor-pointer"
                        >
                            <Plus size={14} /> Add Another Expertise ({expertiseFields.length}/10)
                        </button>
                    )}

                    {/* Save / Cancel */}
                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={handleExpertiseSave}
                            disabled={updatingExpertise}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-950/20 active:scale-95 cursor-pointer"
                        >
                            {updatingExpertise ? <><Loader2 size={12} className="inline animate-spin mr-1.5" />Saving...</> : 'Save'}
                        </button>
                        <button
                            onClick={() => setEditingExpertise(false)}
                            disabled={updatingExpertise}
                            className="bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InstructorExpertise
