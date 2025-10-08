import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { MdArrowOutward, MdCheckCircle, MdUploadFile, MdClose } from "react-icons/md";
import toastifyAlert from "../../../util/toastify";
import { useDispatch } from "react-redux";
import getSweetAlert from "../../../util/sweetAlert";
import { instructorRequest } from "../../../redux/slice/instructorSlice";

const InstructorRequestForm = ({ userData }) => {
    const [showToast, setShowToast] = useState(false),
        imgType = ['jpeg', 'jpg', 'png'],
        [uploadedFile, setUploadedFile] = useState(null),
        dispatch = useDispatch();

    const { control, register, handleSubmit, reset, formState, setError } = useForm({
        defaultValues: { expertise: "", bio: "", resume: null }
    }),
        { errors, isSubmitting } = formState;

    const onSubmit = async (data) => {
        console.log("Received data", data);

        const expertiseArray = data.expertise
            .split(",")
            .map(item => item.trim())
            .filter(item => item.length > 0);

        if (!data.bio || expertiseArray.length === 0) {
            getSweetAlert("Error", "Bio and at least one expertise are required.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("bio", data.bio);
        expertiseArray.forEach(item => formData.append("expertise[]", item)); 
        formData.append("id", data.resume);

        try {
            const res = await dispatch(instructorRequest(formData));
            console.log("Response from instructor request form", res);

            setShowToast(true);
            reset({ expertise: "", bio: "", resume: null });
            setUploadedFile(null);

            setTimeout(() => setShowToast(false), 3000);
        } catch (err) {
            console.error("Error occurred in instructor request", err);
            getSweetAlert("Oops...", "Something went wrong!", "error");
        }
    };

    const validateFile = (file) => {
        const validTypes = ["application/png", "image/jpeg", "image/jpg"];
        const maxSize = 5 * 1024 * 1024;

        if (!file) return "Resume is required";
        if (!validTypes.includes(file.type)) return "Only JPG files are allowed";
        if (file.size > maxSize) return "File size should not exceed 5MB";
        return true;
    };

    return (
        <div className="h-screen bg-black flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">

            {showToast && (
                <div className="fixed top-6 left-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2 sm:gap-3 max-w-sm sm:max-w-md -translate-x-1/2">
                    <MdCheckCircle className="text-lg sm:text-xl flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-center sm:text-left">
                        Request submitted successfully! We'll review your application soon.
                    </p>
                </div>
            )}

            <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl bg-gradient-to-br from-purple-700 to-black/30 border border-purple-500 p-5 sm:p-7 md:p-8 backdrop-blur-md overflow-hidden">
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
                        Become an Instructor
                    </h2>
                    <p className="text-purple-300 font-semibold text-xs sm:text-sm">
                        Join Webittles and share your knowledge with learners worldwide
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 gap-3 sm:gap-4 max-h-[70vh] sm:max-h-[75vh] overflow-y-auto pr-1"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-1">
                            Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Your Full Name" value={userData.user.name} disabled
                            className={`w-full p-3 rounded-xl bg-white/10 border focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm`}
                        />
                        {/* {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>} */}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-1">
                            Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email" value={userData.user.email}
                            placeholder="Your Email" disabled
                            className={`w-full p-3 rounded-xl bg-white/10 border focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm`}
                        />
                        {/* {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>} */}
                    </div>

                    {/* Expertise */}
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-1">
                            Area of Expertise <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Web Development"
                            {...register("expertise", {
                                required: "Expertise is required",
                                minLength: { value: 3, message: "Min 3 characters" },
                            })}
                            className={`w-full p-3 rounded-xl bg-white/10 border ${errors.expertise ? "border-red-500" : "border-white/20"} focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm`}
                        />
                        {errors.expertise && (
                            <p className="text-red-400 text-xs mt-1">{errors.expertise.message}</p>
                        )}
                    </div>

                    {/* About */}
                    <div>
                        <label className="block text-white/90 text-sm font-medium mb-1">
                            About (Bio) <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            placeholder="Tell us about yourself..."
                            rows="2"
                            {...register("bio", {
                                required: "Bio is required",
                                minLength: { value: 10, message: "Bio must be at least 10 characters long" },
                            })}
                            className={`w-full p-3 rounded-xl bg-white/10 border ${errors.bio ? "border-red-500" : "border-white/20"} focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 placeholder:text-white/60 text-white text-sm resize-none`}
                        ></textarea>
                        {errors.bio && (
                            <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>
                        )}
                    </div>

                    {/* Resume Upload with Controller */}
                    <Controller
                        name="resume"
                        control={control}
                        rules={{
                            validate: validateFile,
                        }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-white/90 text-sm font-medium mb-1">
                                    Upload Resume <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="file"
                                    id="resume-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        field.onChange(file);
                                        setUploadedFile(file);
                                    }}
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className={`w-full p-5 rounded-xl bg-white/10 border-2 border-dashed ${errors.resume ? "border-red-500" : "border-white/30"} hover:border-white/50 transition-all cursor-pointer flex items-center justify-between gap-3`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <MdUploadFile className="text-xl text-white/70" />
                                        <span className="text-white text-xs sm:text-sm font-medium truncate">
                                            {uploadedFile ? uploadedFile.name : "Upload PDF/JPG"}
                                        </span>
                                    </div>
                                    {uploadedFile && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setUploadedFile(null);
                                                field.onChange(null);
                                            }}
                                            className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                                        >
                                            <MdClose className="text-lg" />
                                        </button>
                                    )}
                                </label>
                                {errors.resume && (
                                    <p className="text-red-400 text-xs mt-1">{errors.resume.message}</p>
                                )}
                            </div>
                        )}
                    />

                    {/* Submit */}
                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-white/10 border border-white/30 hover:bg-purple-700 hover:border-purple-600 px-6 py-3 rounded-full text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <MdArrowOutward className="text-base sm:text-lg" />
                            {isSubmitting ? "Submitting..." : "Submit Application"}
                        </button>
                    </div>

                    <p className="text-white/60 text-[10px] sm:text-xs text-center">
                        We'll review your application within 3-5 business days
                    </p>
                </form>
            </div>
        </div>
    );
}

export default InstructorRequestForm;