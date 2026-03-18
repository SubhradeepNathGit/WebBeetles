import React, { useEffect, useState, useCallback } from "react";
import { MdArrowOutward, MdCheckCircle, MdAdd, MdDelete, MdUpload, MdClose, MdImage, MdVideoLibrary } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { allCategory } from "../../../redux/slice/categorySlice";
import { Loader2, TriangleAlert } from "lucide-react";
import { createCourse } from "../../../redux/slice/couseSlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import { useForm } from "react-hook-form";
import { addVideo } from "../../../redux/slice/videoSlice";
import toastifyAlert from "../../../util/alert/toastify";
import { useFieldArray } from "react-hook-form";

const AddCourseForm = () => {
  const { register, handleSubmit, reset, setValue, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      thumbnail: null,
      // sectionTitle: "",
      lectureTitle: "",
      lectureVideo: null,
      features: [{ value: "" }],
      // lectureDuration: "",
    },
  });

  const { fields: featureFields, append: addFeature, remove: removeFeature } = useFieldArray({ control, name: "features" });

  const dispatch = useDispatch(),
    imgType = ['jpeg', 'jpg', 'png'],
    videoType = ['mp4', 'mov', 'avi'];

  const { isCategoryLoading, getCategoryData } = useSelector((state) => state.category),
    { isUserLoading, userAuthData, userError } = useSelector(state => state.checkAuth),
    { isCourseLoading, getCourseData, isCourseError } = useSelector(state => state.course),
    { isVideoLoading, videoData, hasVideoError } = useSelector(state => state.lecture);

  const [showToast, setShowToast] = useState(false);
  const [thumbnailProgress, setThumbnailProgress] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [showThumbnailMsg, setShowThumbnailMsg] = useState(false);

  useEffect(() => {
    dispatch(allCategory('active'))
      .then((res) => {
        // console.log("Category fetching response", res);
      })
      .catch((err) => {
        getSweetAlert("Oops...", "Something went wrong!", "error");
        console.error("Error occurred", err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const simulateUpload = useCallback((setProgress, onComplete) => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          setProgress(progress);
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
            resolve();
          }, 500);
        } else {
          setProgress(progress);
        }
      }, 200);
    });
  }, []);


  const handleThumbnailChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailProgress(0);

      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);

      setShowThumbnailMsg(false);
      setValue("thumbnail", e.target.files, { shouldValidate: true });

      await simulateUpload(setThumbnailProgress, () =>
        setTimeout(() => setThumbnailProgress(-1), 1000)
      );
    }
  };

  const handleVideoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // store video
    setVideoFile(file);
    setVideoProgress(0);
    setVideoError(false);

    // register in react-hook-form
    setValue("lectureVideo", file, { shouldValidate: true });

    try {
      const durationInSeconds = await getVideoDuration(file);

      const durationInMinutes = Math.ceil(durationInSeconds / 60);

      // auto-fill duration field
      // setValue("lectureDuration", durationInMinutes, {
      //   shouldValidate: true,
      // });
    } catch (err) {
      console.error(err);
    }

    await simulateUpload(
      setVideoProgress,
      () => setTimeout(() => setVideoProgress(-1), 1000)
    );
  };

  const removeThumbnail = useCallback(() => {
    setThumbnailFile(null);
    setThumbnailProgress(0);
    setThumbnailPreview(null);
    setShowThumbnailMsg(true);
    setValue("thumbnail", null, { shouldValidate: true });
  }, [setValue]);

  const removeVideo = () => {
    setVideoFile(null);
    setVideoProgress(0);
    setVideoError(true);
    setValue("lectureVideo", null, { shouldValidate: true });

    const input = document.getElementById("video");
    if (input) input.value = "";
  };

  const resetFormState = useCallback(() => {
    setThumbnailFile(null);
    setThumbnailProgress(0);
    setThumbnailPreview(null);

    setVideoFile(null);
    setVideoProgress(0);
    setVideoError(false);

    reset(
      {
        title: "",
        description: "",
        price: "",
        category: "",
        thumbnail: null,
        // sectionTitle: "",
        lectureTitle: "",
        lectureVideo: null,
        features: [{ value: "" }],
        // lectureDuration: "",
      },
      { keepValues: false }
    );

    const thumb = document.getElementById("thumbnail");
    if (thumb) thumb.value = "";

    const video = document.getElementById("video");
    if (video) video.value = "";
  }, [reset]);

  const getVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");

      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration); // seconds (number)
      };

      video.onerror = () => {
        reject("Failed to load video metadata");
      };
    });
  };

  const onSubmit = async (data) => {

    if (!thumbnailFile) return setShowThumbnailMsg(true);
    if (!videoFile) return setVideoError(true);

    const durationInSeconds = await getVideoDuration(videoFile);
    const durationInMinutes = Math.ceil(durationInSeconds / 60);

    const featureList = data.features.map(f => f.value);

    const courseObj = {
      title: data?.title?.split(" ")?.map(t => t?.charAt(0)?.toUpperCase() + t?.slice(1)?.toLowerCase())?.join(" "),
      description: data?.description,
      price: data?.price,
      category_id: data?.category,
      instructor_id: userAuthData?.id,
      status: 'pending',
      is_admin_block:false,
      is_active: true,
      is_completed: false,
      is_exam_scheduled: false,
      thumbnail: data?.thumbnail,
      feature: featureList
    }

    const sections = {
      course_id: null,
      category_id: data?.category,
      video_title: data.lectureTitle,
      duration: durationInSeconds?.toFixed(2),
      status: 'active',
      isPreview: true,
      type: 'video',
      views: 0,
      lecture_name: null,
      video_url: videoFile
    };


    if (data.lectureVideo && data.lectureVideo.size / (1024 * 1024) > 500) {
      toastifyAlert.warn("Lecture video size should less than 500MB");
    }

    else if (data.lectureVideo && !videoType.includes(data.lectureVideo.type.split('/')[1])) {
      toastifyAlert.warn("Lecture video type should be mp4 / mov / avi");
    }

    else if (data.thumbnail?.[0] && data.thumbnail[0].size / 1024 > 500) {
      toastifyAlert.warn("Profile image size should less than 500KB");
    }

    else if (data.thumbnail?.[0] && !imgType.includes(data.thumbnail[0].type.split('/')[1])) {
      toastifyAlert.warn("Profile image type should be jpeg / jpg / png");
    }
    else {
      dispatch(createCourse(courseObj))
        .then(res => {
          // console.log('Response after adding new course', res);

          if (res.meta.requestStatus === "fulfilled") {

            dispatch(addVideo({ data: { ...sections, course_id: res.payload.course_id }, doc_type: 'video' }))
              .then(res => {
                // console.log('Response after adding new lecture', res);

                if (res.meta.requestStatus === "fulfilled") {
                  setShowToast(true);
                  resetFormState();
                } else {
                  getSweetAlert("Oops...", "Failed to create course. Try again.", "error");
                }
              })
              .catch(error => {
                console.error("Error while submitting course:", error);
                getSweetAlert("Error", "Something went wrong while uploading the course.", "error");
              })
          } else {
            getSweetAlert("Oops...", "Failed to create course. Try again.", "error");
          }
        })
        .catch(error => {
          console.error("Error while submitting course:", error);
          getSweetAlert("Error", "Something went wrong while uploading the course.", "error");
        })
    }
  };

  // console.log('All available category',getCategoryData,userAuthData);

  const inputClass = useCallback(
    (err) =>
      `w-full px-4 py-3 rounded-xl bg-white/5 border ${err ? "border-red-400/60" : "border-white/10"
      } focus:outline-none focus:border-purple-400/60 focus:bg-white/10 text-white placeholder:text-white/40 transition-all duration-200 hover:border-white/20`,
    []
  );

  const ErrorMsg = ({ msg }) =>
    msg && (
      <p className="text-red-300 text-xs mt-1.5 flex items-center gap-1">
        <span><TriangleAlert className="w-3 h-3" /></span> {msg}
      </p>
    );

  if (isCategoryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 px-3 sm:px-4 bg-black">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300 w-[calc(100%-1.5rem)] sm:w-auto">
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3 backdrop-blur-sm">
            <div className="bg-white/20 rounded-full p-1">
              <MdCheckCircle className="text-xl sm:text-2xl" />
            </div>
            <div>
              <p className="font-semibold text-sm sm:text-base">Success!</p>
              <p className="text-xs sm:text-sm text-white/90">
                Course uploaded successfully! It's now under review.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-gradient-to-br from-purple-700 to-black/30 border border-purple-500 rounded-2xl shadow-2xl overflow-hidden"
        >

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {/* Left Column */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="pb-3 sm:pb-4 border-b border-white/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                  <span className="bg-purple-500/20 text-purple-300 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">01</span>
                  Course Details
                </h2>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Course Title *</label>
                <input type="text" {...register("title", { required: "Title is required" })} placeholder="e.g., Complete Web Development Bootcamp" className={inputClass(errors.title)} />
                <ErrorMsg msg={errors.title?.message} />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Course Description *</label>
                <textarea {...register("description", { required: "Description is required", minLength: { value: 400, message: "Minimum 400 characters required" }, maxLength: { value: 600, message: "Maximum 600 characters required" } })} placeholder="Provide a detailed description of what students will learn..." rows={7} className={`${inputClass(errors.description)} resize-none`} />
                <ErrorMsg msg={errors.description?.message} />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Price (₹) *</label>
                  <input type="number" step="0.01" {...register("price", { required: "Price is required", min: { value: 0, message: "Price must be positive" } })} placeholder="4999" className={inputClass(errors.price)} />
                  <ErrorMsg msg={errors.price?.message} />
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Category *</label>
                  <select {...register("category", { required: "Category is required" })} className={inputClass(errors.category)}>
                    <option value="">Choose category</option>
                    {getCategoryData?.map(cat => (
                      <option key={cat?.id} value={cat?.id} className="bg-purple-900">{cat?.name}</option>
                    ))}
                  </select>
                  <ErrorMsg msg={errors?.category?.message} />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Course Thumbnail *</label>
                {!thumbnailFile ? (
                  <>
                    <input type="file" accept="image/*" id="thumbnail-upload" className="hidden" onChange={handleThumbnailChange} />
                    <label htmlFor="thumbnail-upload" className={`group flex flex-col items-center justify-center w-full h-32 sm:h-40 rounded-xl bg-purple-500/10 border-2 border-dashed ${errors.thumbnail ? "border-red-400/60" : "border-purple-400/30"} hover:border-purple-400/60 hover:bg-purple-500/20 cursor-pointer transition-all duration-200`}>
                      <MdImage className="text-4xl sm:text-5xl text-purple-400/60 group-hover:text-purple-300 transition-colors mb-2 sm:mb-3" />
                      <p className="text-white/60 group-hover:text-white/80 font-medium text-sm sm:text-base">Click to upload thumbnail</p>
                      <p className="text-white/40 text-xs mt-1">PNG, JPG, JPEG up to 500KB</p>
                    </label>
                  </>
                ) : (
                  <div className="bg-white/5 border border-white/20 rounded-xl overflow-hidden">
                    <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4">
                      {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail preview" className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg object-cover border border-white/20" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <p className="text-white text-xs sm:text-sm font-medium truncate">{thumbnailFile.name}</p>
                            <p className="text-white/50 text-xs">{(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                          <button type="button" onClick={removeThumbnail} className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 p-1.5 rounded-lg transition-colors" title="Remove thumbnail">
                            <MdClose className="text-lg sm:text-xl" />
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {thumbnailProgress >= 0 && thumbnailProgress < 100 && (
                            <>
                              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full transition-all duration-300 ease-out" style={{ width: `${thumbnailProgress}%` }} />
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-white/60 text-xs">Uploading...</span>
                                <span className="text-white/70 text-xs font-medium">{Math.round(thumbnailProgress)}%</span>
                              </div>
                            </>
                          )}
                          {thumbnailProgress === -1 && (
                            <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm">
                              <MdCheckCircle className="text-base sm:text-lg" />
                              <span>Uploaded</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {showThumbnailMsg && <ErrorMsg msg='Thumbnail is required' />}
              </div>

            </div>

            {/* Right Column */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="pb-3 sm:pb-4 border-b border-white/10">
                <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                  <span className="bg-purple-500/20 text-purple-300 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">02</span>
                  Course Content
                </h2>
              </div>

              {/* <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Section Title *</label>
                <input type="text" {...register("sectionTitle", { required: "Section title is required" })} placeholder="e.g., Introduction to React" className={inputClass(errors.sectionTitle)} />
                <ErrorMsg msg={errors.sectionTitle?.message} />
              </div> */}

              <div className="space-y-3">
                <label className="block text-white/90 text-sm font-medium">
                  Course Features *
                </label>

                {featureFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Feature ${index + 1}`}
                      {...register(`features.${index}.value`, {
                        required: "Feature is required",
                      })}
                      className={inputClass(errors?.features?.[index]?.value)}
                    />

                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 cursor-pointer"
                        title="Remove feature"
                      >
                        <MdDelete />
                      </button>
                    )}
                  </div>
                ))}

                {featureFields.length < 6 && (
                  <button
                    type="button"
                    onClick={() => addFeature({ value: "" })}
                    className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium cursor-pointer"
                  >
                    <MdAdd />
                    Add Feature
                  </button>
                )}

                {/* Error */}
                {errors?.features && (
                  <ErrorMsg msg="Feature fields are required" />
                )}
              </div>

              <div className="space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-white/90 font-semibold text-base sm:text-lg">
                    Lecture
                  </h3>
                </div>

                {/* Scroll container (kept as-is) */}
                <div className="max-h-[400px] sm:max-h-[600px] overflow-y-auto pr-2
                      [scrollbar-width:thin]
                      [scrollbar-color:rgba(168,85,247,0.5)_rgba(255,255,255,0.05)]
                      [&::-webkit-scrollbar]:w-2.5
                      [&::-webkit-scrollbar-track]:bg-white/5
                      [&::-webkit-scrollbar-track]:backdrop-blur-md
                      [&::-webkit-scrollbar-thumb]:bg-gradient-to-b
                      [&::-webkit-scrollbar-thumb]:from-purple-500/70
                      [&::-webkit-scrollbar-thumb]:to-purple-700/70
                      [&::-webkit-scrollbar-thumb]:backdrop-blur-lg
                      [&::-webkit-scrollbar-thumb]:border
                      [&::-webkit-scrollbar-thumb]:border-white/10
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:shadow-[0_0_8px_rgba(168,85,247,0.6)]
                      [&::-webkit-scrollbar-thumb]:hover:from-purple-400/80
                      [&::-webkit-scrollbar-thumb]:hover:to-purple-600/80
                      [&::-webkit-scrollbar-thumb]:hover:shadow-[0_0_10px_rgba(192,132,252,0.8)]
                    ">

                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-5 space-y-3 sm:space-y-4 hover:bg-white/[0.07] transition-colors my-2">

                    {/* Title */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 font-medium text-xs sm:text-sm">
                        Demo Lecture
                      </span>
                    </div>

                    {/* Lecture title */}
                    <div>
                      <label className="block text-white/80 text-xs font-medium mb-1.5">
                        Lecture Title *
                      </label>
                      <input type="text"
                        {...register("lectureTitle", {
                          required: "Lecture title is required",
                        })}
                        placeholder="e.g., Setting up React environment"
                        className={inputClass(errors.lectureTitle)}
                      />
                      <ErrorMsg msg={errors?.lectureTitle?.message} />
                    </div>

                    {/* Video */}
                    <div>
                      <label className="block text-white/80 text-xs font-medium mb-1.5">
                        Video *
                      </label>

                      {!videoFile ? (
                        <>
                          <input type="file" accept="video/*" id="video" className="hidden" onChange={handleVideoChange} />

                          <label
                            htmlFor="video"
                            className={`group flex items-center gap-2 sm:gap-3 w-full p-3 sm:p-4 rounded-xl bg-purple-500/10 border
                                  ${videoError ? "border-red-400/60" : "border-purple-400/30"}
                                  hover:border-purple-400/60 hover:bg-purple-500/20 cursor-pointer transition-all duration-200`}
                          >
                            <MdVideoLibrary className="text-purple-400/60 group-hover:text-purple-300 text-xl sm:text-2xl" />

                            <div className="flex-1 text-left">
                              <p className="text-white/70 group-hover:text-white/90 text-xs sm:text-sm font-medium">
                                Upload video file
                              </p>
                              <p className="text-white/40 text-xs">
                                MP4, MOV, AVI up to 500MB
                              </p>
                            </div>

                            <MdUpload className="text-purple-400/60 group-hover:text-purple-300 text-lg sm:text-xl" />
                          </label>
                        </>
                      ) : (
                        <div className="bg-white/5 border border-white/20 rounded-xl p-3 sm:p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="bg-purple-500/20 p-1.5 sm:p-2 rounded-lg">
                                <MdVideoLibrary className="text-purple-300 text-lg sm:text-xl" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-white text-xs sm:text-sm font-medium truncate">
                                  {videoFile.name}
                                </p>
                                <p className="text-white/50 text-xs">
                                  {(videoFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={removeVideo}
                              className="text-gray-400 hover:text-gray-300 hover:bg-gray-500/10 p-1.5 rounded-lg"
                            >
                              <MdClose className="text-base sm:text-lg" />
                            </button>
                          </div>

                          {/* Progress */}
                          <div className="space-y-1.5">
                            {videoProgress >= 0 && videoProgress < 100 && (
                              <>
                                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-full transition-all duration-300"
                                    style={{ width: `${videoProgress}%` }}
                                  />
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-white/60 text-xs">Uploading...</span>
                                  <span className="text-white/70 text-xs font-medium">
                                    {Math.round(videoProgress)}%
                                  </span>
                                </div>
                              </>
                            )}

                            {videoProgress === -1 && (
                              <div className="flex items-center gap-2 text-emerald-400 text-xs sm:text-sm">
                                <MdCheckCircle className="text-base sm:text-lg" />
                                <span>Uploaded</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {videoError && <ErrorMsg msg="Video is required" />}
                    </div>

                    {/* Duration */}
                    {/* <div>
                      <label className="block text-white/80 text-xs font-medium mb-1.5">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        {...register("lectureDuration", {
                          required: "Duration is required",
                          min: { value: 1, message: "Duration must be at least 1 minute" },
                        })}
                        placeholder="15"
                        className={inputClass(errors.lectureDuration)}
                      />
                      <ErrorMsg msg={errors?.lectureDuration?.message} />
                    </div> */}

                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Submit Button */}
          <div className="p-4 sm:p-8 bg-white/5 border-t border-white/10">
            <button type="submit" disabled={isCourseLoading || isVideoLoading} className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-800 disabled:to-indigo-800 disabled:cursor-not-allowed px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold  transition-all duration-200 hover:scale-[1.02]  flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg ${(isCourseLoading || isVideoLoading) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              {(isCourseLoading || isVideoLoading) ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Uploading Course...
                </>
              ) : (
                <>
                  <span>Upload Course</span>
                  <MdArrowOutward className="text-lg sm:text-xl" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseForm;
