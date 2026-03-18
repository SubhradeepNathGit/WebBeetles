import React, { useState } from 'react'
import { Code, Edit3, Loader2, Plus, Tag, X } from 'lucide-react';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import toastifyAlert from '../../../../util/alert/toastify';
import { updateInstructor } from '../../../../redux/slice/instructorSlice';
import hotToast from '../../../../util/alert/hot-toast';
import { useDispatch } from 'react-redux';

const InstructorExpertise = ({ instructorDetails }) => {

    const [expertise, setExpertise] = useState(instructorDetails?.expertise || []);
    const [tempExpertise, setTempExpertise] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [updatingExpertise, setUpdatingExpertise] = useState(false);
    const [editingExpertise, setEditingExpertise] = useState(false);

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
                        setEditingExpertise(false);
                        setExpertise(res?.payload?.expertise);
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
        <div className="bg-white/10 backdrop-blur-xl rounded-xl lg:rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-purple-500/30 flex items-center justify-center border border-purple-400/30"><Code size={18} className="text-purple-300" /></div>
                    Expertise
                </h2>
                {!editingExpertise && <button onClick={() => { setTempExpertise([...expertise]); setEditingExpertise(true); }} className="text-xs sm:text-sm text-purple-200 hover:text-white font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all border border-white/20 cursor-pointer"><Edit3 size={14} className="inline mr-1" /> Edit</button>}
            </div>

            {!editingExpertise ? (
                <div className="flex flex-wrap gap-2">
                    {expertise?.length > 0 ? expertise?.map((skill, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border border-white/20">
                            <Tag size={12} />{skill}
                        </span>
                    )) : <p className="text-purple-200 text-sm">No skills added.</p>}
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                            placeholder="Add skill..." className="flex-1 bg-white/10 text-purple-100 placeholder:text-purple-300/50 rounded-lg px-3 py-2 text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50" />
                        <button onClick={addSkill}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"><Plus size={16} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tempExpertise.map((skill, idx) => (
                            <span key={idx} className="inline-flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-lg text-sm border border-white/20">
                                {skill}<button onClick={() => removeSkill(skill)} className="hover:text-red-400"><X size={14} /></button>
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleExpertiseSave} disabled={updatingExpertise} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
                            {updatingExpertise ? <><Loader2 size={14} className="inline animate-spin mr-2" />Saving...</> : 'Save'}
                        </button>
                        <button onClick={() => setEditingExpertise(false)} disabled={updatingExpertise} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-white/20">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default InstructorExpertise