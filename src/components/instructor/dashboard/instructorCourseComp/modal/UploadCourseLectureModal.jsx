import React, { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addVideo, editLecture } from "../../../../../redux/slice/videoSlice";
import getSweetAlert from "../../../../../util/alert/sweetAlert";
import hotToast from "../../../../../util/alert/hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const MAX_PDF_SIZE = 200 * 1024 * 1024;
const videoType = ['mp4', 'mov', 'avi'];

const UploadCourseLectureModal = ({ setShowUploadModal, uploadForm, updateData, setUpdateData }) => {

    const [videoDuration, setVideoDuration] = useState(0);
    const isEdit = Boolean(updateData);

    const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            title: updateData?.video_title || "",
            file: null
        }
    });

    const selectedFile = watch("file");
    const isVideo = !isEdit ? uploadForm?.sectionType === "video" : updateData?.type;
    const queryClient = useQueryClient();

    const dispatch = useDispatch();
    const { isVideoLoading, videoData, hasVideoError } = useSelector(state => state?.lecture);

    const getVideoDuration = (file) =>
        new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
                resolve(video.duration);
                URL.revokeObjectURL(video.src);
            };

            video.onerror = () => reject("Invalid video file");
            video.src = URL.createObjectURL(file);
        });

    const handleFileChange = async (files, rhfOnChange) => {
        rhfOnChange(files);

        if (!isVideo || !files?.length) return;

        try {
            const duration = await getVideoDuration(files[0]);
            setVideoDuration(Number(duration.toFixed(2)));
        } catch (err) {
            console.error(err);
        }
    };

    const validateFile = (files) => {
        if (isEdit && (!files || !files.length)) return true;

        if (!files || !files.length) return "File is required";

        const file = files[0];

        if (isVideo) {
            if (!file.type.startsWith("video/"))
                return "Only video files are allowed";

            if (!videoType.includes(file.type.split("/")[1]))
                return "Lecture video type should be mp4 / mov / avi";

            if (file.size > MAX_VIDEO_SIZE)
                return "Video size must be under 500MB";
        } else {
            if (file.type !== "application/pdf")
                return "Only PDF files are allowed";

            if (file.size > MAX_PDF_SIZE)
                return "PDF size must be under 200MB";
        }

        return true;
    };

    const onSubmit = async (data) => {

        const hasNewFile = data.file?.length;

        const payload = {
            id: updateData?.id,
            course_id: !isEdit ? uploadForm.course_id : updateData?.course_id,
            category_id: !isEdit ? uploadForm.category_id : updateData?.category_id,
            video_title: data.title,
            duration: hasNewFile ? videoDuration : updateData?.duration,
            status: !isEdit ? "active" : updateData?.status,
            isPreview: !isEdit ? false : updateData?.isPreview,
            type: !isEdit ? uploadForm.sectionType : updateData?.type,
            views: updateData?.views || 0,
            video_url: hasNewFile ? data.file[0] : updateData?.video_url,
            old_path: updateData?.lecture_name
        };

        dispatch(isEdit ? editLecture({ data: payload, doc_type: payload.type }) : addVideo({ data: payload, doc_type: payload.type }))
            .then(res => {
                // console.log(`Response after ${!isEdit ? 'adding new' : 'updating'} lecture`, res);

                if (res.meta.requestStatus === "fulfilled") {

                    queryClient.invalidateQueries({
                        queryKey: ['course-videos', payload?.course_id],
                    });

                    setShowUploadModal(null);
                    setUpdateData(null);
                    hotToast(`Lecture ${isEdit ? "updated" : "uploaded"} successfully!`, "success");
                } else {
                    hotToast(`Failed to ${!isEdit ? 'upload' : 'update'} lecture. Try again.`, "error");
                }
            })
            .catch(error => {
                console.error("Error while submitting course:", error);
                getSweetAlert("Error", "Something went wrong while uploading the lecture.", "error");
            })
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setValue("file", e.dataTransfer.files, { shouldValidate: true });
    };

    const contentType = !isEdit ? uploadForm.sectionType : updateData?.type;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-8 max-w-2xl w-full border border-gray-800">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Upload Content</h2>
                    <button
                        onClick={() => setShowUploadModal(null)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Content Type
                        </label>
                        <select value={contentType} disabled
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
                            <option value={contentType}>
                                {contentType?.charAt(0)?.toUpperCase() + contentType?.slice(1)}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <input
                            {...register("title", { required: "Title is required" })}
                            placeholder="Lesson title"
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3"
                        />
                        {errors.title && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    <Controller name="file" control={control} rules={{ validate: validateFile }}
                        render={({ field }) => (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    {isVideo ? "Video File" : "Document File"}
                                </label>

                                <label onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
                                    className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer block"
                                >
                                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-500" />

                                    {selectedFile?.[0] ? (
                                        <p className="text-green-400 text-sm">{selectedFile[0].name}</p>
                                    ) : (
                                        <>
                                            <p className="text-gray-400 mb-2"> Click to upload or drag and drop </p>
                                            <p className="text-xs text-gray-500">{isVideo ? "MP4, MOV, AVI (max. 500MB)" : "PDF (max. 200MB)"}</p>
                                        </>
                                    )}

                                    <input type="file" accept={isVideo ? "video/*" : "application/pdf"}
                                        className="hidden" onChange={(e) => handleFileChange(e.target.files, field.onChange)} />
                                </label>

                                {errors.file && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.file.message}
                                    </p>
                                )}
                            </div>
                        )}
                    />

                    {/* ACTION BUTTONS */}
                    <div className="flex gap-3 pt-4">
                        <button type="submit" disabled={isVideoLoading}
                            className={`flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors ${isVideoLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            {isVideoLoading ? <Loader2 className="w-4 h-4 animate-spin inline" /> : ''} {isEdit ? 'Update' : 'Upload'}
                        </button>
                        <button type="button" onClick={() => setShowUploadModal(null)} disabled={isVideoLoading}
                            className={`flex-1 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-colors ${isVideoLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadCourseLectureModal;
