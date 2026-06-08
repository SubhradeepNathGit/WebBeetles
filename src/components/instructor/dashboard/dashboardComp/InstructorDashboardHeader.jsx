import React, { useEffect, useRef, useState } from 'react'
import { Calendar, Loader2, Camera, Edit3, X, CheckCircle2, Shield, BadgeCheck, UserCircle, Mail } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import { formatDate } from '../../../../util/dateFormat/dateFormat';
import hotToast from '../../../../util/alert/hot-toast';
import { updateInstructor } from '../../../../redux/slice/instructorSlice';
import { checkLoggedInUser } from '../../../../redux/slice/authSlice/checkUserAuthSlice';
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
        // console.log("Photo updated successfully!", previewUrl);

        const formData = new FormData();
        formData.append('profileImage', file);
        instructorDetails = { ...instructorDetails, profileImage: file };


        dispatch(updateInstructor({ data: instructorDetails, id: instructorDetails?.id }))
            .then(res => {
                // console.log('Response from photo update', res);

                if (res.meta.requestStatus === "fulfilled") {
                    const freshUrl = res.payload.profile_image_url;
                    setPhoto(freshUrl);
                    dispatch(checkLoggedInUser());
                    hotToast('Profile updated successfully', "success");
                }
                else {
                    hotToast('Something went wrong!', "error");
                }
            })
            .catch(() => {
                getSweetAlert("Oops...", "Something went wrong!", "error");
            })
            .finally(() => {
                setUpdatingPhoto(false);
            });
    };

    // handle bio 
    const handleBioSave = async () => {
        instructorDetails = { ...instructorDetails, bio: tempBio };

        if (!tempBio.trim()) {
            toastifyAlert.warn("Bio cannot be empty!");
            return;
        }
        else {
            dispatch(updateInstructor({ data: instructorDetails, id: instructorDetails?.id }))
                .then(res => {
                    // console.log('Response from bio update', res);

                    if (res.meta.requestStatus === "fulfilled") {

                        hotToast('Profile updated successfully', "success");
                        setBio(tempBio);
                        setEditingBio(false);
                    }
                    else {
                        hotToast('Something went wrong!', "error");
                    }
                })
                .catch(() => {
                    getSweetAlert("Oops...", "Something went wrong!", "error");
                })
        }
    };

    return (
        <div className="rounded-xl bg-[#111] border border-white/8 px-6 py-6 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 lg:gap-6">
                <div className="relative flex-shrink-0">
                    <div className="w-18 h-18 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full ring-1 ring-white/15 overflow-hidden shadow-2xl bg-[#1e1e2e]">
                        {photo ? <img src={photo} className="w-full h-full object-cover rounded-full" /> :
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl sm:text-3xl lg:text-4xl font-bold">{name[0].toUpperCase()}</div>}
                    </div>
                    {isVerified && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white shadow-lg">
                            <BadgeCheck size={16} className="text-white" />
                        </div>
                    )}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={updatingPhoto}
                        className="absolute -bottom-2 -right-2 bg-[#222] hover:bg-[#2a2a2a] text-white p-3 rounded-full transition-all shadow-xl border border-white/15 disabled:opacity-50 hover:scale-110 active:scale-95"
                    >
                        {updatingPhoto ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                </div>

                <div className="flex-1 text-center md:text-left w-full">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5 lg:mb-2 flex-wrap">
                        <span className="text-xs font-bold text-white/50 bg-white/6 px-2.5 py-1 rounded-full border border-white/10">INSTRUCTOR DASHBOARD</span>
                        {isApproved && <span className="text-xs font-bold text-green-300 bg-green-500/15 px-2.5 py-1 rounded-full border border-green-500/30 flex items-center gap-1"><CheckCircle2 size={12} /> APPROVED</span>}
                        {isVerified && <span className="text-xs font-bold text-blue-300 bg-blue-500/15 px-2.5 py-1 rounded-full border border-blue-500/30 flex items-center gap-1"><Shield size={12} /> VERIFIED</span>}
                    </div>

                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1.5 lg:mb-2">
                        Welcome back, <span className="text-red-400">{name?.split(" ")[0]}</span> Sir!
                    </h1>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2.5 lg:mb-3 text-xs sm:text-sm">
                        {email && <div className="flex items-center gap-1.5 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 max-w-full"><Mail size={14} className="flex-shrink-0" /><span className="truncate">{email}</span></div>}
                        {slug && <div className="flex items-center gap-1.5 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 max-w-full"><UserCircle size={14} className="flex-shrink-0" /><span className="truncate">@{slug}</span></div>}
                        {createdAt && <div className="flex items-center gap-1.5 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 max-w-full"><Calendar size={14} className="flex-shrink-0" /><span className="truncate">Joined {formatDate(createdAt)}</span></div>}
                    </div>

                    {!editingBio ? (
                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 lg:gap-3">
                            <div className="flex-1 bg-white/5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/10">
                                <p className="text-gray-300 text-xs sm:text-sm lg:text-base">{bio || "No bio added yet."}</p>
                            </div>
                            <button onClick={handleEditBio} className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600/30 hover:bg-emerald-600/50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-emerald-500/40 transition-all hover:shadow-lg active:scale-95 cursor-pointer">
                                <Edit3 size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 lg:gap-3">
                            <div className="relative">
                                <textarea value={tempBio} onChange={(e) => setTempBio(e.target.value)} rows={3} maxLength={500} placeholder="Write a short bio about yourself..." className="bg-white/5 text-gray-200 placeholder:text-gray-500 rounded-xl w-full text-xs sm:text-sm p-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none" />
                                <span className="absolute bottom-2 right-2 text-xs text-gray-400 bg-black/20 px-2 py-1 rounded-lg">{tempBio.length}/500</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleBioSave} disabled={isInstructorLoading} className="inline-flex items-center justify-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-green-600 hover:bg-green-700 rounded-xl text-white font-semibold transition-all disabled:opacity-50 hover:shadow-lg active:scale-95 flex-1">
                                    {isInstructorLoading ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><CheckCircle2 size={14} />Save</>}
                                </button>
                                <button onClick={() => setEditingBio(false)} disabled={isInstructorLoading} className="inline-flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all hover:shadow-lg active:scale-95 border border-white/20">
                                    <X size={14} /> Cancel
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
