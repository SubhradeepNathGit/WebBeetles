import React, { useState } from 'react'
import { Code, Edit3, Loader2, Plus, Tag, X } from 'lucide-react';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import toastifyAlert from '../../../../util/alert/toastify';
import { updateInstructor } from '../../../../redux/slice/instructorSlice';
import { setUserAuthData } from '../../../../redux/slice/authSlice/checkUserAuthSlice';
import hotToast from '../../../../util/alert/hot-toast';
import { useDispatch } from 'react-redux';

const InstructorExpertise = ({ instructorDetails }) => {

    const [expertise, setExpertise] = useState(instructorDetails?.expertise || []);
    const [tempExpertise, setTempExpertise] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [updatingExpertise, setUpdatingExpertise] = useState(false);
    const [editingExpertise, setEditingExpertise] = useState(false);

    React.useEffect(() => {
        setExpertise(instructorDetails?.expertise || []);
        if (!editingExpertise) setTempExpertise(instructorDetails?.expertise || []);
    }, [instructorDetails?.expertise]);

    const dispatch = useDispatch();

    // handle expertise
    const handleExpertiseSave = async () => {

        setUpdatingExpertise(true);
        const updatedExpertise = tempExpertise?.map(exp => exp?.split(",")?.map(ex => ex?.split(" ")?.map(e => e?.charAt(0)?.toUpperCase() + e?.slice(1)?.toLowerCase())?.join(" "))?.join(","));

        const instructor_obj = { ...instructorDetails, expertise: updatedExpertise };

        if (tempExpertise.length === 0) {
            toastifyAlert.warn("Experties cannot be empty!");
            return;
        }
        else {
            dispatch(updateInstructor({ data: instructor_obj, id: instructorDetails?.id }))
                .then(res => {
                    // console.log('Response from experties update', res);

                    if (res.meta.requestStatus === "fulfilled") {
                        dispatch(setUserAuthData(res.payload));
                        setEditingExpertise(false);
                        setExpertise(res?.payload?.expertise || []);
                        hotToast('Expertise updated successfully', "success");
                    }
                    else {
                        hotToast('Something went wrong!', "error");
                    }
                })
                .catch(err => {
                    console.error("Error occurred in updating experties", err);
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                })
                .finally(() => {
                    setUpdatingExpertise(false);
                });
        }
    };

    const addSkill = () => {
        const skill = newSkill.trim();
        if (skill && !tempExpertise.includes(skill)) {
            setTempExpertise([...tempExpertise, skill]);
            setNewSkill("");
        }
    };

    const removeSkill = (skillToRemove) => {
        setTempExpertise(tempExpertise.filter(s => s !== skillToRemove));
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
                        onClick={() => { setTempExpertise([...expertise]); setEditingExpertise(true); }}
                        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-all duration-300 font-medium cursor-pointer"
                    >
                        <Edit3 size={12} /> Edit
                    </button>
                )}
            </div>

            {!editingExpertise ? (
                <div className="flex flex-wrap gap-2">
                    {expertise?.length > 0 ? expertise?.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 bg-zinc-900/30 text-zinc-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-850 hover:border-zinc-700/80 hover:bg-zinc-900/60 hover:text-white transition-colors duration-200 cursor-default">
                            <Tag size={11} className="text-rose-400/80" />{skill}
                        </span>
                    )) : <p className="text-zinc-500 text-xs sm:text-sm italic">No expertise added yet.</p>}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            placeholder="Add skill..."
                            className="flex-1 bg-zinc-900/30 text-zinc-200 placeholder:text-zinc-600 rounded-lg px-3.5 py-2 text-xs border border-zinc-800 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all"
                        />
                        <button
                            onClick={addSkill}
                            className="bg-zinc-900 hover:bg-zinc-850 text-zinc-200 border border-zinc-800 hover:border-zinc-700 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                        >
                            <Plus size={16} />
                        </button>
                    </div>
                    {tempExpertise.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 py-1">
                            {tempExpertise.map((skill, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 bg-zinc-900/40 text-zinc-200 px-2.5 py-1.5 rounded-lg text-xs border border-zinc-850">
                                    {skill}
                                    <button onClick={() => removeSkill(skill)} className="text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-2">
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
