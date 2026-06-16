import React, { useEffect, useRef, useState } from 'react'
import { Calendar, Loader2, Camera, Edit3, X, CheckCircle2, Shield, BadgeCheck, UserCircle, Mail } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import { formatDate } from '../../../../util/dateFormat/dateFormat';
import hotToast from '../../../../util/alert/hot-toast';
import supabase from '../../../../util/supabase/supabase';
import { setUserAuthData } from '../../../../redux/slice/authSlice/checkUserAuthSlice';
import toastifyAlert from '../../../../util/alert/toastify';

const InstructorDashboardHeader = ({ instructorDetails }) => {
    const dispatch = useDispatch(),
        imgType = ['jpeg', 'jpg', 'png'];

    const name = instructorDetails?.name || "Instructor";
    const slug = instructorDetails?.name?.toLowerCase()?.split(" ")?.join("-") || "";
    const email = instructorDetails?.email || "";
    const createdAt = instructorDetails?.created_at || "";

    const [updatingPhoto, setUpdatingPhoto] = useState(false);
    const [tempBio, setTempBio] = useState("");
    const [editingBio, setEditingBio] = useState(false);
    const fileInputRef = useRef(null);
    const [photo, setPhoto] = useState(instructorDetails?.profile_image_url || instructorDetails?.profile_image);
    const [bio, setBio] = useState(instructorDetails?.bio || "");
    const isVerified = instructorDetails?.isVerified == "fulfilled" ? true : false;
    const isApproved = instructorDetails?.isApproved || false;

    const { isInstructorLoading } = useSelector(state => state?.instructor);

    useEffect(() => {
        if (instructorDetails?.profile_image_url) {
            setPhoto(instructorDetails.profile_image_url);
        }
    }, [instructorDetails]);

    const handleEditBio = () => {
        setTempBio(bio);
        setEditingBio(true);
    };

    useEffect(() => {
        if (instructorDetails?.bio) {
            setBio(instructorDetails.bio);
        }
    }, [instructorDetails]);

    // handle profile-pic 
    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toastifyAlert.warn('Please upload an image file');
            return;
        }

        if (file.size > 100 * 1024) {
            toastifyAlert.warn('Profile image size should be less than 100KB');
            return;
        }

        if (!imgType.includes(file.type.split('/')[1])) {
            toastifyAlert.warn("Profile image type should be jpeg / jpg / png");
            return;
        }

        setUpdatingPhoto(true);

        const previewUrl = URL.createObjectURL(file);

        if (photo && photo.startsWith("blob:")) {
            URL.revokeObjectURL(photo);
        }
        setPhoto(previewUrl);

        try {
            const id = instructorDetails?.id;

            // Delete old image from bucket
            if (instructorDetails?.profile_image) {
                await supabase.storage.from("instructor").remove([`image/${instructorDetails.profile_image}`]);
            }

            // Upload new file
            const newFileName = `${id}_${Date.now()}.${file.name.split(".").pop()}`;
            const { data: uploadData, error: uploadError } = await supabase.storage.from("instructor/image").upload(newFileName, file, { upsert: true });
            if (uploadError) throw uploadError;

            const image_name = uploadData?.path;

            // Get public URL
            const { data: publicUrlData } = supabase.storage.from("instructor/image").getPublicUrl(newFileName);
            const publicUrl = publicUrlData.publicUrl;

            // Update ONLY image fields in DB — don't touch expertise/social_links/bio
            const { data: updatedData, error: updateError } = await supabase
                .from("instructors")
                .update({ profile_image_url: publicUrl, profile_image: image_name })
                .eq("id", id)
                .select()
                .single();

            if (updateError) throw updateError;

            setPhoto(updatedData.profile_image_url);
            dispatch(setUserAuthData(updatedData));
            hotToast('Profile updated successfully', "success");
        }
        catch (err) {
            console.error("Error updating profile photo:", err);
            hotToast('Something went wrong!', "error");
        }
        finally {
            setUpdatingPhoto(false);
        }
    };

    // handle bio 
    const handleBioSave = async () => {
        if (!tempBio.trim()) {
            toastifyAlert.warn("Bio cannot be empty!");
            return;
        }

        try {
            // Update ONLY the bio field — don't touch expertise/social_links
            const { data: updatedData, error } = await supabase
                .from("instructors")
                .update({ bio: tempBio })
                .eq("id", instructorDetails?.id)
                .select()
                .single();

            if (error) throw error;

            dispatch(setUserAuthData(updatedData));
            setBio(tempBio);
            setEditingBio(false);
            hotToast('Profile updated successfully', "success");
        }
        catch (err) {
            console.error("Error updating bio:", err);
            hotToast('Something went wrong!', "error");
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900/30 p-6 md:p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 left-0 -translate-x-12 -translate-y-12 w-64 h-64 bg-gradient-to-tr from-rose-500/10 via-pink-500/5 to-violet-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-10 relative z-10">
                <div className="relative flex-shrink-0 group/avatar">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full shadow-2xl overflow-hidden bg-zinc-900">
                        {photo ? <img src={photo} className="w-full h-full object-cover rounded-full group-hover/avatar:scale-105 transition-transform duration-500" /> :
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-100 text-3xl lg:text-4xl font-extrabold">{name[0].toUpperCase()}</div>}
                    </div>
                    {isVerified && (
                        <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1.5 shadow-lg" title="Verified Instructor">
                            <BadgeCheck size={18} />
                        </div>
                    )}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={updatingPhoto}
                        className="absolute bottom-0 right-0 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white p-2.5 rounded-full transition-all duration-300 shadow-xl disabled:opacity-50 hover:scale-110 active:scale-95 cursor-pointer animate-fade-in"
                        title="Update profile picture"
                    >
                        {updatingPhoto ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </div>

                <div className="flex-1 text-center md:text-left w-full flex flex-col justify-center">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4 flex-wrap">
                        <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800/40 px-3 py-1.5 rounded-full tracking-widest uppercase">INSTRUCTOR DASHBOARD</span>
                        {isApproved && <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 tracking-wider"><CheckCircle2 size={12} /> APPROVED</span>}
                        {isVerified && <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 tracking-wider"><Shield size={12} /> VERIFIED</span>}
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        Welcome back, <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">{name?.split(" ")[0]}</span> Sir!
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6 lg:mb-8 text-xs sm:text-sm">
                        {email && <div className="flex items-center gap-2 text-zinc-300 bg-zinc-800/30 px-4 py-2 rounded-full hover:bg-zinc-800/50 transition-all duration-300 max-w-full"><Mail size={14} className="text-zinc-500 flex-shrink-0" /><span className="truncate font-medium">{email}</span></div>}
                        {slug && <div className="flex items-center gap-2 text-zinc-300 bg-zinc-800/30 px-4 py-2 rounded-full hover:bg-zinc-800/50 transition-all duration-300 max-w-full"><UserCircle size={14} className="text-zinc-500 flex-shrink-0" /><span className="truncate font-medium">@{slug}</span></div>}
                        {createdAt && <div className="flex items-center gap-2 text-zinc-300 bg-zinc-800/30 px-4 py-2 rounded-full hover:bg-zinc-800/50 transition-all duration-300 max-w-full"><Calendar size={14} className="text-zinc-500 flex-shrink-0" /><span className="truncate font-medium">Joined {formatDate(createdAt)}</span></div>}
                    </div>

                    {!editingBio ? (
                        <div className="relative group/bio bg-zinc-800/20 hover:bg-zinc-800/40 transition-all duration-300 p-5 lg:p-6 rounded-2xl flex items-start justify-between gap-5 shadow-inner">
                            <p className="text-zinc-300 text-sm lg:text-base leading-relaxed flex-1 text-left font-medium">{bio || "No bio added yet."}</p>
                            <button onClick={handleEditBio} className="flex-shrink-0 flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700 p-3 rounded-xl transition-all duration-300 shadow-sm cursor-pointer hover:scale-105 active:scale-95">
                                <Edit3 size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <textarea value={tempBio} onChange={(e) => setTempBio(e.target.value)} rows={3} maxLength={500} placeholder="Write a short bio about yourself..." className="bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 rounded-2xl w-full text-sm p-5 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all resize-none shadow-inner border-none" />
                                <span className="absolute bottom-4 right-4 text-[10px] text-zinc-500 bg-zinc-950/60 px-2 py-1 rounded-md">{tempBio.length}/500</span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleBioSave} disabled={isInstructorLoading} className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 rounded-xl text-white font-bold transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-emerald-950/20 active:scale-95 flex-1 cursor-pointer">
                                    {isInstructorLoading ? <><Loader2 size={16} className="animate-spin" />Saving...</> : <><CheckCircle2 size={16} />Save Bio</>}
                                </button>
                                <button onClick={() => setEditingBio(false)} disabled={isInstructorLoading} className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-300 font-bold transition-all hover:text-white active:scale-95 cursor-pointer">
                                    <X size={16} /> Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default InstructorDashboardHeader
