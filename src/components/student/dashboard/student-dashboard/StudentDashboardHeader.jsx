import React, { useRef, useState } from 'react';
import { Download, Loader2, Camera } from "lucide-react";
import { updateStudentProfile } from '../../../../redux/slice/studentSlice';
import { useDispatch, useSelector } from 'react-redux';
import toastifyAlert from '../../../../util/alert/toastify';
import hotToast from '../../../../util/alert/hot-toast';

const StudentDashboardHeader = ({ userDetails }) => {

    const userName = userDetails?.name || userDetails?.fullName || "Student";
    const [userPhoto, setUserPhoto] = useState(userDetails?.profile_image_url || userDetails?.profilePhoto);
    const fileInputRef = useRef(null),
        dispatch = useDispatch();
    const [photo, setPhoto] = useState(userDetails?.profile_image_url || userDetails?.profilePhoto);
    const imgType = ['jpeg', 'jpg', 'png'];

    const { isStudentLoading, getStudentData, isStudentError } = useSelector(state => state?.student);

    // console.log('User data',userDetails);

    // handle profile-pic 
    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        // console.log(file);

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

        const previewUrl = URL.createObjectURL(file);

        if (photo && photo.startsWith("blob:")) {
            URL.revokeObjectURL(photo);
        }
        setUserPhoto(previewUrl);
        // console.log("Photo updated successfully!", previewUrl);
        // console.log(previewUrl.split('/')[previewUrl.split('/').length-1]);

        const image_obj = {
            profile_image: file
        }

        dispatch(updateStudentProfile({
            data: image_obj,
            id: userDetails.id,
        }))
            .then(res => {
                // console.log('Response from photo update', res);

                if (res.meta.requestStatus === "fulfilled") {
                    const freshUrl = res.payload.profile_image_url + `?t=${Date.now()}`;
                    setUserPhoto(freshUrl);
                    hotToast('Profile image updated successfully', "success");
                }
                else {
                    hotToast('Something went wrong!', "error");
                }
            })
            .catch(err => {
                console.error("Error occurred in uploading photo", err);
                getSweetAlert("Oops...", "Something went wrong!", "error");
            });
    };

    return (
        <div className="bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 backdrop-blur-xl rounded-3xl shadow-2xl mb-8 border border-white/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

            <div className="px-6 md:px-8 py-8 md:py-10 relative z-10">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1 flex items-center gap-4 md:gap-6">

                        {/* PROFILE IMAGE WRAPPER */}
                        <div className="relative w-16 h-16 md:w-20 md:h-20">
                            <div className="w-full h-full rounded-full ring-4 ring-white/30 overflow-hidden shadow-2xl bg-gradient-to-br from-purple-400 to-pink-500">
                                {userPhoto ? (
                                    <img
                                        src={userPhoto}
                                        alt={userName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            {/* UPLOAD BUTTON */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isStudentLoading}
                                className="absolute bottom-0 right-0 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-2 rounded-full transition-all shadow-lg border border-white/30 disabled:opacity-50 hover:scale-110 active:scale-95 cursor-pointer"
                            >
                                {isStudentLoading ? (
                                    <Loader2 size={16} className="animate-spin" />) : (<Camera size={16} />)}
                            </button>

                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                        </div>

                        {/* USER INFO */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-sm font-semibold text-purple-200 bg-white/20 px-3 py-1 rounded-full">
                                    Student Dashboard
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                                Welcome back, {userDetails?.name?.split(" ")[0] || "Student"}!
                            </h1>
                            <p className="text-purple-100 text-sm md:text-base">
                                Continue your learning journey and achieve your goals
                            </p>
                        </div>
                    </div>

                    {/* DOWNLOAD BUTTON */}
                    <button className="flex items-center gap-2 px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-xl font-medium transition-all shadow-lg border border-white/30 hover:scale-105 cursor-pointer">
                        <Download size={18} />
                        <span className="hidden sm:inline">Download Report</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StudentDashboardHeader