import React, { useRef, useState } from 'react';
import { Download, Loader2, Camera } from "lucide-react";
import { updateStudentProfile } from '../../../../redux/slice/studentSlice';
import { useDispatch, useSelector } from 'react-redux';
import toastifyAlert from '../../../../util/alert/toastify';
import hotToast from '../../../../util/alert/hot-toast';

const planColors = {
  STARTER: { label: 'Starter Plan', dot: 'bg-purple-500', text: 'text-purple-400', badge: 'bg-purple-500/15 border-purple-500/30 text-purple-300' },
  PRO:     { label: 'Pro Plan',     dot: 'bg-blue-500',   text: 'text-blue-400',   badge: 'bg-blue-500/15 border-blue-500/30 text-blue-300' },
  EXPERT:  { label: 'Expert Plan',  dot: 'bg-amber-500',  text: 'text-amber-400',  badge: 'bg-amber-500/15 border-amber-500/30 text-amber-300' },
};

const StudentDashboardHeader = ({ userDetails }) => {
  const userName = userDetails?.name || userDetails?.fullName || "Student";
  const [userPhoto, setUserPhoto] = useState(userDetails?.profile_image_url || userDetails?.profilePhoto);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const imgType = ['jpeg', 'jpg', 'png'];

  const { isStudentLoading } = useSelector(state => state?.student);
  const currentPlan = userDetails?.subscription_plan;
  const planCfg = currentPlan ? planColors[currentPlan] : null;

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/'))           { toastifyAlert.warn('Please upload an image file'); return; }
    if (file.size > 100 * 1024)                    { toastifyAlert.warn('Profile image size should be less than 100KB'); return; }
    if (!imgType.includes(file.type.split('/')[1])){ toastifyAlert.warn("Profile image type should be jpeg / jpg / png"); return; }

    setUserPhoto(URL.createObjectURL(file));

    dispatch(updateStudentProfile({ data: { profile_image: file }, id: userDetails.id }))
      .then(res => {
        if (res.meta.requestStatus === "fulfilled") {
          setUserPhoto(res.payload.profile_image_url + `?t=${Date.now()}`);
          hotToast('Profile image updated successfully', "success");
        } else {
          hotToast('Something went wrong!', "error");
        }
      })
      .catch(() => hotToast('Upload failed', "error"));
  };

  return (
    <div className="rounded-xl bg-[#111] border border-white/8 px-6 py-6 mb-6 flex items-center justify-between gap-6 flex-wrap">
      {/* Left — avatar + info */}
      <div className="flex items-center gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-1 ring-white/15">
            {userPhoto ? (
              <img src={userPhoto} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#1e1e2e] text-white text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Camera button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isStudentLoading}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-md bg-[#222] border border-white/15
              flex items-center justify-center cursor-pointer hover:bg-[#2a2a2a] transition-colors"
          >
            {isStudentLoading
              ? <Loader2 size={11} className="animate-spin text-white/60" />
              : <Camera size={11} className="text-white/60" />
            }
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
        </div>

        {/* Text */}
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/6 border border-white/10 text-white/50 uppercase tracking-wide">
              Student Dashboard
            </span>
            {planCfg ? (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${planCfg.badge}`}>
                {planCfg.label}
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
                No Active Plan
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Welcome back, <span className="text-purple-400">{userDetails?.name?.split(" ")[0] || "Student"}</span>!
          </h1>
          <p className="text-sm text-white/40 mt-0.5">Continue your learning journey and achieve your goals</p>
        </div>
      </div>


    </div>
  );
};

export default StudentDashboardHeader;