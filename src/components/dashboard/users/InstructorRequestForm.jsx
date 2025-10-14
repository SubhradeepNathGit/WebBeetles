// import React, { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { MdArrowOutward, MdCheckCircle, MdUploadFile, MdClose } from "react-icons/md";
// import toastifyAlert from "../../../util/toastify";
// import { useDispatch } from "react-redux";
// import getSweetAlert from "../../../util/sweetAlert";
// import { instructorRequest } from "../../../redux/slice/instructorSlice";

// const InstructorRequestForm = ({ userData }) => {
//     const [showToast, setShowToast] = useState(false),
//         imgType = ['jpeg', 'jpg', 'png'],
//         [uploadedFile, setUploadedFile] = useState(null),
//         dispatch = useDispatch();

//     const { control, register, handleSubmit, reset, formState, setError } = useForm({
//         defaultValues: { expertise: "", bio: "", resume: null }
//     }),
//         { errors, isSubmitting } = formState;

//     const onSubmit = async (data) => {
//         console.log("Received data", data);

//         const expertiseArray = data.expertise
//             .split(",")
//             .map(item => item.trim())
//             .filter(item => item.length > 0);

//         if (!data.bio || expertiseArray.length === 0) {
//             getSweetAlert("Error", "Bio and at least one expertise are required.", "error");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("bio", data.bio);
//         expertiseArray.forEach(item => formData.append("expertise[]", item)); 
//         formData.append("id", data.resume);

//         try {
//             const res = await dispatch(instructorRequest(formData));
//             console.log("Response from instructor request form", res);

//             setShowToast(true);
//             reset({ expertise: "", bio: "", resume: null });
//             setUploadedFile(null);

//             setTimeout(() => setShowToast(false), 3000);
//         } catch (err) {
//             console.error("Error occurred in instructor request", err);
//             getSweetAlert("Oops...", "Something went wrong!", "error");
//         }
//     };

//     const validateFile = (file) => {
//         const validTypes = ["application/png", "image/jpeg", "image/jpg"];
//         const maxSize = 5 * 1024 * 1024;

//         if (!file) return "Resume is required";
//         if (!validTypes.includes(file.type)) return "Only JPG files are allowed";
//         if (file.size > maxSize) return "File size should not exceed 5MB";
//         return true;
//     };

//     return (
//         <div className="h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">

//             {showToast && (
//                 <div className="fixed top-6 left-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 sm:gap-3 max-w-sm sm:max-w-md -translate-x-1/2">
//                     <MdCheckCircle className="text-lg sm:text-xl flex-shrink-0" />
//                     <p className="text-xs sm:text-sm font-medium text-center sm:text-left">
//                         Request submitted successfully! We'll review your application soon.
//                     </p>
//                 </div>
//             )}

//             <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl bg-gradient-to-br from-purple-700 to-black/30 border border-purple-500 p-5 sm:p-7 md:p-8 backdrop-blur-md overflow-hidden">
//                 <div className="text-center mb-4 sm:mb-6">
//                     <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
//                         Become an Instructor
//                     </h2>
//                     <p className="text-purple-300 font-semibold text-xs sm:text-sm">
//                         Join Webittles and share your knowledge with learners worldwide
//                     </p>
//                 </div>

//                 <form
//                     onSubmit={handleSubmit(onSubmit)}
//                     className="grid grid-cols-1 gap-3 sm:gap-4 max-h-[70vh] sm:max-h-[75vh] overflow-y-auto pr-1"
//                 >
//                     {/* Name */}
//                     <div>
//                         <label className="block text-white/90 text-sm font-medium mb-1">
//                             Full Name <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="Your Full Name" value={userData.user.name} disabled
//                             className={`w-full p-3 rounded-xl bg-white/10 border focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm`}
//                         />
//                         {/* {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>} */}
//                     </div>

//                     {/* Email */}
//                     <div>
//                         <label className="block text-white/90 text-sm font-medium mb-1">
//                             Email Address <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             type="email" value={userData.user.email}
//                             placeholder="Your Email" disabled
//                             className={`w-full p-3 rounded-xl bg-white/10 border focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm`}
//                         />
//                         {/* {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>} */}
//                     </div>

//                     {/* Expertise */}
//                     <div>
//                         <label className="block text-white/90 text-sm font-medium mb-1">
//                             Area of Expertise <span className="text-red-400">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="e.g., Web Development"
//                             {...register("expertise", {
//                                 required: "Expertise is required",
//                                 minLength: { value: 3, message: "Min 3 characters" },
//                             })}
//                             className={`w-full p-3 rounded-xl bg-white/10 border ${errors.expertise ? "border-red-500" : "border-white/20"} focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm`}
//                         />
//                         {errors.expertise && (
//                             <p className="text-red-400 text-xs mt-1">{errors.expertise.message}</p>
//                         )}
//                     </div>

//                     {/* About */}
//                     <div>
//                         <label className="block text-white/90 text-sm font-medium mb-1">
//                             About (Bio) <span className="text-red-400">*</span>
//                         </label>
//                         <textarea
//                             placeholder="Tell us about yourself..."
//                             rows="2"
//                             {...register("bio", {
//                                 required: "Bio is required",
//                                 minLength: { value: 10, message: "Bio must be at least 10 characters long" },
//                             })}
//                             className={`w-full p-3 rounded-xl bg-white/10 border ${errors.bio ? "border-red-500" : "border-white/20"} focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm resize-none`}
//                         ></textarea>
//                         {errors.bio && (
//                             <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>
//                         )}
//                     </div>

//                     {/* Resume Upload with Controller */}
//                     <Controller
//                         name="resume"
//                         control={control}
//                         rules={{
//                             validate: validateFile,
//                         }}
//                         render={({ field }) => (
//                             <div>
//                                 <label className="block text-white/90 text-sm font-medium mb-1">
//                                     Upload Resume <span className="text-red-400">*</span>
//                                 </label>
//                                 <input
//                                     type="file"
//                                     id="resume-upload"
//                                     accept="image/*"
//                                     className="hidden"
//                                     onChange={(e) => {
//                                         const file = e.target.files[0];
//                                         field.onChange(file);
//                                         setUploadedFile(file);
//                                     }}
//                                 />
//                                 <label
//                                     htmlFor="resume-upload"
//                                     className={`w-full p-5 rounded-xl bg-white/10 border-2 border-dashed ${errors.resume ? "border-red-500" : "border-white/30"} hover:border-white/50 transition-all cursor-pointer flex items-center justify-between gap-3`}
//                                 >
//                                     <div className="flex items-center gap-2 truncate">
//                                         <MdUploadFile className="text-xl text-white/70" />
//                                         <span className="text-white text-xs sm:text-sm font-medium truncate">
//                                             {uploadedFile ? uploadedFile.name : "Upload PDF/JPG"}
//                                         </span>
//                                     </div>
//                                     {uploadedFile && (
//                                         <button
//                                             type="button"
//                                             onClick={() => {
//                                                 setUploadedFile(null);
//                                                 field.onChange(null);
//                                             }}
//                                             className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
//                                         >
//                                             <MdClose className="text-lg" />
//                                         </button>
//                                     )}
//                                 </label>
//                                 {errors.resume && (
//                                     <p className="text-red-400 text-xs mt-1">{errors.resume.message}</p>
//                                 )}
//                             </div>
//                         )}
//                     />

//                     {/* Submit */}
//                     <div>
//                         <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="bg-white/10 border border-white/30 hover:bg-purple-700 hover:border-purple-600 px-6 py-3 rounded-full text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
//                         >
//                             <MdArrowOutward className="text-base sm:text-lg" />
//                             {isSubmitting ? "Submitting..." : "Submit Application"}
//                         </button>
//                     </div>

//                     <p className="text-white/60 text-[10px] sm:text-xs text-center">
//                         We'll review your application within 3-5 business days
//                     </p>
//                 </form>
//             </div>
//         </div>
//     );
// }

// export default InstructorRequestForm;










import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { MdArrowOutward, MdCheckCircle, MdUploadFile, MdClose, MdAdd, MdDelete } from "react-icons/md";
import { FaFacebook, FaLinkedin, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import getSweetAlert from "../../../util/sweetAlert";
import { instructorRequest } from "../../../redux/slice/instructorSlice";

const InstructorRequestForm = ({ userData }) => {
    const [showToast, setShowToast] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [expertiseFields, setExpertiseFields] = useState([{ id: Date.now(), value: "" }]);
    const dispatch = useDispatch();

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

    const onSubmit = async (data) => {
        const expertiseArray = expertiseFields.map(f => f.value.trim()).filter(i => i.length > 0);
        if (!data.bio || !expertiseArray.length) return getSweetAlert("Error", "Bio and at least one expertise are required.", "error");

        const formData = new FormData();
        formData.append("bio", data.bio);
        expertiseArray.forEach(item => formData.append("expertise[]", item));
        formData.append("id", data.resume);
        ["facebook", "linkedin", "instagram", "twitter"].forEach(s => data[s] && formData.append(s, data[s]));

        try {
            const res = await dispatch(instructorRequest(formData));
            console.log("Response from instructor request form", res);
            setShowToast(true);
            reset();
            setUploadedFile(null);
            setUploadProgress(0);
            setExpertiseFields([{ id: Date.now(), value: "" }]);
            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error("Error occurred in instructor request", err);
            getSweetAlert("Oops...", "Something went wrong!", "error");
        }
    };

    const validateFile = (file) => {
        if (!file) return "Resume is required";
        if (!["application/pdf", "image/jpeg", "image/jpg", "image/png"].includes(file.type)) return "Only PDF/JPG/PNG files are allowed";
        if (file.size > 5 * 1024 * 1024) return "File size should not exceed 5MB";
        return true;
    };

    const InputField = ({ label, placeholder, value, disabled, required }) => (
        <div>
            <label className="block text-white/90 text-sm font-medium mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input type="text" placeholder={placeholder} value={value} disabled={disabled} className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm" />
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

            <div className="w-full max-w-7xl rounded-2xl sm:rounded-3xl shadow-2xl bg-gradient-to-br from-purple-700 to-black/30 border border-purple-500 p-5 sm:p-7 md:p-8 backdrop-blur-md">
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Become an Instructor</h2>
                    <p className="text-purple-300 font-semibold text-xs sm:text-sm">Join Webittles and share your knowledge with learners worldwide</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        {/* Left Column */}
                        <div className="space-y-3 sm:space-y-4">
                            <InputField label="Full Name" placeholder="Your Full Name" value={userData.user.name} disabled required />
                            <InputField label="Email Address" placeholder="Your Email" value={userData.user.email} disabled required />

                            {/* Expertise */}
                            <div>
                                <label className="block text-white/90 text-sm font-medium mb-2">Area of Expertise <span className="text-red-400">*</span></label>
                                <div className="space-y-2">
                                    {expertiseFields.map((field, idx) => (
                                        <div key={field.id} className="flex gap-2">
                                            <input type="text" placeholder={`e.g., ${idx === 0 ? 'Web Development' : 'UI/UX Design'}`} value={field.value} onChange={(e) => updateExpertiseValue(field.id, e.target.value)} className="flex-1 p-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm" />
                                            {expertiseFields.length > 1 && <button type="button" onClick={() => removeExpertiseField(field.id)} className="p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors"><MdDelete className="text-lg" /></button>}
                                        </div>
                                    ))}
                                    {expertiseFields.length < 10 && <button type="button" onClick={addExpertiseField} className="w-full p-3 rounded-xl bg-white/10 border border-dashed border-white/30 text-white/70 hover:bg-white/15 hover:border-white/50 transition-all flex items-center justify-center gap-2 text-sm"><MdAdd className="text-lg" />Add Another Expertise ({expertiseFields.length}/10)</button>}
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
                        <button type="button" onClick={handleSubmit(onSubmit)} disabled={isSubmitting || isUploading} className="bg-white/10 border border-white/30 hover:bg-purple-700 hover:border-purple-600 px-6 py-3 rounded-full text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                            <MdArrowOutward className="text-base sm:text-lg" />
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                        </button>
                        <p className="text-white/60 text-[10px] sm:text-xs text-center mt-3">We'll review your application within 3-5 business days</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorRequestForm;
