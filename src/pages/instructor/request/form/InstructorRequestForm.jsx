import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { MdArrowOutward, MdCheckCircle, MdUploadFile, MdClose, MdAdd, MdDelete } from "react-icons/md";
import { FaFacebook, FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import getSweetAlert from "../../../../util/alert/sweetAlert";
import { instructorRequest } from "../../../../redux/slice/instructorSlice";
import { useLocation, useNavigate } from "react-router-dom";
import toastifyAlert from "../../../../util/alert/toastify";
import { Loader2 } from "lucide-react";
import hotToast from "../../../../util/alert/hot-toast";

const InstructorRequestForm = () => {
    const [showToast, setShowToast] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [expertiseFields, setExpertiseFields] = useState([{ id: Date.now(), value: "" }]);
    const dispatch = useDispatch();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isInstructorLoading, getInstructorData, isInstructorError } = useSelector(state => state?.instructor);

    const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: { bio: "", resume: null, facebook: "", linkedin: "", instagram: "", twitter: "" }
    });

    const addExpertiseField = () => expertiseFields.length < 10 && setExpertiseFields([...expertiseFields, { id: Date.now(), value: "" }]);
    const removeExpertiseField = (id) => expertiseFields.length > 1 && setExpertiseFields(expertiseFields.filter(f => f.id !== id));
    const updateExpertiseValue = (id, value) => setExpertiseFields(expertiseFields.map(f => f.id === id ? { ...f, value } : f));

    const simulateUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => setUploadProgress(p => {
            if (p >= 100) { clearInterval(interval); setIsUploading(false); return 100; }
            return p + 10;
        }), 200);
    };

    const showSuccessAndNavigate = () => {
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            navigate("/instructor/request-status", {
                state: state?.instructorData
            });
        }, 3500);
    };

    const onSubmit = async (data) => {
        const expertise = expertiseFields.map(f => f.value.trim()).filter(Boolean);

        if (!data.bio || expertise.length === 0) {
            return toastifyAlert.warn("Minimum one expertise is required.");
        }

        const social_links = {
            facebook: data.facebook || null,
            linkedin: data.linkedin || null,
            instagram: data.instagram || null,
            twitter: data.twitter || null,
        };

        const instructorObj = {
            id: state?.instructorData?.id,
            bio: data.bio,
            expertise: expertise?.map(exp => exp?.split(",")?.map(ex => ex?.split(" ")?.map(e => e?.charAt(0)?.toUpperCase() + e?.slice(1)?.toLowerCase())?.join(" "))?.join(",")),
            document: uploadedFile || null,
            social_links,
        };

        dispatch(instructorRequest({ payload: instructorObj, id: state?.instructorData?.id }))
            .then(res => {
                // console.log('Response after adding details in function', res);

                if (res.meta.requestStatus === "fulfilled") {
                    
                    reset();
                    setUploadedFile(null);
                    setUploadProgress(0);
                    setExpertiseFields([{ id: Date.now(), value: "" }]);

                    showSuccessAndNavigate();
                }
                else {
                    hotToast("Something went wrong!", "error");
                }

            }).catch(err => {
                console.log('Error occured', err);
                getSweetAlert("Oops...", "Something went wrong!", "error");
            })
    };

    const validateFile = (file) => {
        if (!file) return "Resume is required";
        if (!["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(file.type)) return "Only PDF/JPG/JPEG/PNG files are allowed";
        if (file.size > 500 * 1024) return "File size should not exceed 500KB";
        return true;
    };

    const InputField = ({ label, placeholder, value, disabled, required }) => (
        <div>
            <label className="block text-white/90 text-sm font-medium mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input type="text" placeholder={placeholder} value={value} disabled={disabled} className={`w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm ${disabled ? 'cursor-not-allowed' : ''}`} />
        </div>
    );

    const SocialInput = ({ icon: Icon, name, placeholder, color }) => (
        <div>
            <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${color} flex-shrink-0`}><Icon className="text-lg" /></div>
                <input type="url" placeholder={placeholder} {...register(name, { pattern: { value: /^(https?:\/\/)?(www\.)?(facebook|linkedin|instagram|twitter|x)\.com\/.+$/, message: `Please enter a valid ${placeholder.split(' ')[0]} URL` } })} className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm" />
            </div>
            {errors[name] && <p className="text-red-400 text-xs mt-1 ml-12">{errors[name].message}</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 overflow-auto">
            {showToast && (
                <div className="fixed top-6 left-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 sm:gap-3 max-w-sm sm:max-w-md -translate-x-1/2">
                    <MdCheckCircle className="text-lg sm:text-xl flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium">Request submitted successfully! We'll review your application soon.</p>
                </div>
            )}

            <div className="w-full max-w-7xl rounded-2xl sm:rounded-3xl shadow-2xl bg-gradient-to-br from-red-700 to-black/30 border border-red-500 p-5 sm:p-7 md:p-8 backdrop-blur-md">
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Become an Instructor</h2>
                    <p className="text-purple-300 font-semibold text-xs sm:text-sm">Join Webbeetles and share your knowledge with learners worldwide</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        {/* Left Column */}
                        <div className="space-y-3 sm:space-y-4">
                            <InputField label="Full Name" placeholder="Your Full Name" value={state?.instructorData?.name ?? 'N/A'} disabled required />
                            <InputField label="Email Address" placeholder="Your Email" value={state?.instructorData?.email ?? 'N/A'} disabled required />

                            {/* Expertise */}
                            <div>
                                <label className="block text-white/90 text-sm font-medium mb-2">Area of Expertise <span className="text-red-400">*</span></label>
                                <div className="space-y-2">
                                    {expertiseFields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input type="text" placeholder={`e.g., ${idx === 0 ? 'Web Development' : 'UI/UX Design'}`} value={field.value} onChange={(e) => updateExpertiseValue(field.id, e.target.value)} className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm" />
                                            {expertiseFields.length > 1 && <button type="button" onClick={() => removeExpertiseField(field.id)} className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"><MdDelete className="text-lg" /></button>}
                                        </div>
                                    ))}
                                    {expertiseFields.length < 10 && <button type="button" onClick={addExpertiseField} className="w-full p-3 rounded-xl bg-white/10 border border-dashed border-white/30 text-white/70 hover:bg-white/15 hover:border-white/50 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"><MdAdd className="text-lg" />Add Another Expertise ({expertiseFields.length}/10)</button>}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-white/90 text-sm font-medium mb-1">About (Bio) <span className="text-red-400">*</span></label>
                                <textarea placeholder="Tell us about yourself..." rows="4" {...register("bio", { required: "Bio is required", minLength: { value: 10, message: "Bio must be at least 10 characters long" } })} className={`w-full p-3 rounded-xl bg-white/10 border ${errors.bio ? "border-red-500" : "border-white/20"} focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm resize-none`}></textarea>
                                {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-3 sm:space-y-4">
                            {/* Social Links */}
                            <div className="space-y-3">
                                <label className="block text-white/90 text-sm font-medium">Social Links (Optional)</label>
                                <SocialInput icon={FaFacebook} name="facebook" placeholder="Facebook Profile URL" color="bg-blue-600/20 border border-blue-500/50 text-blue-400" />
                                <SocialInput icon={FaLinkedin} name="linkedin" placeholder="LinkedIn Profile URL" color="bg-blue-700/20 border border-blue-600/50 text-blue-500" />
                                <SocialInput icon={FaInstagram} name="instagram" placeholder="Instagram Profile URL" color="bg-pink-600/20 border border-pink-500/50 text-pink-400" />
                                <SocialInput icon={FaXTwitter} name="twitter" placeholder="X (Twitter) Profile URL" color="bg-slate-700/20 border border-slate-600/50 text-slate-300" />
                            </div>

                            {/* Resume Upload */}
                            <Controller name="resume" control={control} rules={{ validate: validateFile }} render={({ field }) => (
                                <div>
                                    <label className="block text-white/90 text-sm font-medium mb-1">Upload Resume <span className="text-red-400">*</span></label>
                                    <input type="file" id="resume-upload" accept=".pdf,image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { field.onChange(file); setUploadedFile(file); simulateUpload(); } }} />
                                    <label htmlFor="resume-upload" className={`w-full p-5 rounded-xl bg-white/10 border-2 border-dashed ${errors.resume ? "border-red-500" : "border-white/30"} hover:border-white/50 transition-all cursor-pointer block`}>
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                            <div className="flex items-center gap-2 truncate min-w-0">
                                                <MdUploadFile className="text-xl text-white/70 flex-shrink-0" />
                                                <span className="text-white text-xs sm:text-sm font-medium truncate">{uploadedFile ? uploadedFile.name : "Upload PDF/JPG/PNG"}</span>
                                            </div>
                                            {uploadedFile && !isUploading && <button type="button" onClick={(e) => { e.preventDefault(); setUploadedFile(null); setUploadProgress(0); field.onChange(null); }} className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"><MdClose className="text-lg" /></button>}
                                        </div>
                                        {(isUploading || uploadProgress > 0) && uploadedFile && (
                                            <div className="space-y-1">
                                                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div></div>
                                                <p className="text-white/70 text-xs text-right">{uploadProgress}% uploaded</p>
                                            </div>
                                        )}
                                    </label>
                                    {errors.resume && <p className="text-red-400 text-xs mt-1">{errors.resume.message}</p>}
                                </div>
                            )} />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                        <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || isUploading} className={`border px-6 py-3 rounded-full text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] ${isInstructorLoading ? 'bg-purple-700 border-purple-600 cursor-not-allowed' : 'bg-white/10 border-white/30 hover:bg-purple-700 hover:border-purple-600 cursor-pointer'}`}>
                            {isInstructorLoading ? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline' /> : <MdArrowOutward className="text-base sm:text-lg" />} {isSubmitting ? "Submitting..." : "Submit Application"}
                        </button>
                        <p className="text-white/60 text-[10px] sm:text-xs text-center mt-3">We'll review your application within 5-7 business days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorRequestForm;
