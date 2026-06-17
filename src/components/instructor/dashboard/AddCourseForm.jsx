import React, { useEffect, useState, useCallback, useRef } from "react";
import { MdArrowOutward, MdCheckCircle, MdAdd, MdDelete, MdUpload, MdClose, MdImage, MdVideoLibrary } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { allCategory, createCategory } from "../../../redux/slice/categorySlice";
import { Loader2, TriangleAlert, Plus, Check, ChevronDown, Search } from "lucide-react";
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

  const { isCategoryLoading, isCreatingCategory, getCategoryData } = useSelector((state) => state.category),
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

  // Category dropdown state
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    dispatch(allCategory())
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

  // Close category dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false);
        setShowNewCategoryInput(false);
        setNewCategoryName("");
        setCategorySearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle creating a new category inline
  const handleCreateCategory = async () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    // Check for duplicates (case-insensitive)
    const duplicate = getCategoryData?.find(
      (cat) => cat?.name?.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      toastifyAlert.warn("Category already exists!");
      setSelectedCategory(duplicate);
      setValue("category", duplicate.id, { shouldValidate: true });
      setCategoryDropdownOpen(false);
      setShowNewCategoryInput(false);
      setNewCategoryName("");
      setCategorySearch("");
      return;
    }

    try {
      const res = await dispatch(createCategory(trimmed));
      if (res.meta.requestStatus === "fulfilled") {
        const newCat = res.payload;
        setSelectedCategory(newCat);
        setValue("category", newCat.id, { shouldValidate: true });
        toastifyAlert.success(`Category "${trimmed}" created!`);
        setCategoryDropdownOpen(false);
        setShowNewCategoryInput(false);
        setNewCategoryName("");
        setCategorySearch("");
      } else {
        toastifyAlert.error("Failed to create category. Try again.");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      toastifyAlert.error("Something went wrong.");
    }
  };

  // Filter categories based on search
  const filteredCategories = getCategoryData?.filter((cat) =>
    cat?.name?.toLowerCase().includes(categorySearch.toLowerCase())
  ) || [];

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
    setSelectedCategory(null);

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
      `w-full px-4 py-3 rounded-xl bg-[#111] border ${err ? "border-red-500/60" : "border-white/5"
      } focus:outline-none focus:border-white/20 focus:bg-[#161616] text-white placeholder:text-white/40 transition-all duration-200 hover:border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]`,
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
      <div className="min-h-screen bg-black py-8 px-4 animate-pulse">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 bg-white/5 rounded-lg w-1/3 mb-8"></div>
          <div className="bg-[#111] p-6 rounded-2xl border border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/4"></div>
                <div className="h-10 bg-white/5 rounded-lg w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-white/5 rounded w-1/4"></div>
                <div className="h-10 bg-white/5 rounded-lg w-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded w-1/4"></div>
              <div className="h-28 bg-white/5 rounded-lg w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-white/5 rounded w-1/4"></div>
              <div className="h-40 bg-white/5 rounded-lg w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-black">
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

      <div className="max-w-full mx-auto">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Add New Course</h1>
            <p className="text-gray-400">Fill in the details below to publish your course</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black rounded-2xl overflow-hidden"
        >

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              <div className="pb-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                  <span className="bg-white/5 text-white/70 border border-white/10 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">01</span>
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
                <textarea {...register("description", { required: "Description is required", maxLength: { value: 600, message: "Maximum 600 characters required" } })} placeholder="Provide a detailed description of what students will learn..." rows={7} className={`${inputClass(errors.description)} resize-none`} />
                <ErrorMsg msg={errors.description?.message} />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Price (₹) *</label>
                  <input type="number" step="0.01" {...register("price", { required: "Price is required", min: { value: 0, message: "Price must be positive" } })} placeholder="4999" className={inputClass(errors.price)} />
                  <ErrorMsg msg={errors.price?.message} />
                </div>

                <div ref={categoryDropdownRef} className="relative">
                  <label className="block text-white/90 text-sm font-medium mb-2">Category *</label>

                  {/* Hidden input for react-hook-form */}
                  <input
                    type="hidden"
                    {...register("category", { required: "Category is required" })}
                  />

                  {/* Dropdown trigger */}
                  <div
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className={`w-full px-4 py-3 rounded-xl bg-[#0b0b0d] border ${errors.category ? "border-red-500/60" : "border-transparent"} shadow-[inset_0_1px_0_rgba(255,255,255,0.055),inset_0_-1px_0_rgba(0,0,0,0.75),0_14px_30px_rgba(0,0,0,0.28)] hover:bg-[#101014] focus:ring-2 focus:ring-white/10 text-white transition-all duration-200 cursor-pointer flex items-center justify-between group`}
                  >
                    <span className={selectedCategory ? "text-white" : "text-white/36"}>
                      {selectedCategory ? selectedCategory.name : "Choose category"}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 group-hover:text-white transition-transform duration-200 ${categoryDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Dropdown menu */}
                  {categoryDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-[#0b0b0d] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      
                      {/* Search Bar */}
                      <div className="p-2 border-b border-white/10 relative">
                        <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          autoFocus
                          placeholder="Search categories..."
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          className="w-full bg-transparent pl-8 pr-4 py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
                        />
                      </div>

                      {/* Category List */}
                      <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-1.5">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((cat) => (
                            <div
                              key={cat.id}
                              onClick={() => {
                                setSelectedCategory(cat);
                                setValue("category", cat.id, { shouldValidate: true });
                                setCategoryDropdownOpen(false);
                                setShowNewCategoryInput(false);
                                setCategorySearch("");
                              }}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedCategory?.id === cat.id ? "bg-white/10 text-white" : "hover:bg-white/5 text-white/80"}`}
                            >
                              <span className="text-sm font-medium">{cat.name}</span>
                              {selectedCategory?.id === cat.id && <Check className="w-4 h-4" />}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-white/40 text-sm">
                            No categories found.
                          </div>
                        )}
                      </div>

                      {/* Add New Category Action */}
                      <div className="p-2 border-t border-white/10 bg-white/[0.02]">
                        {!showNewCategoryInput ? (
                          <button
                            type="button"
                            onClick={() => setShowNewCategoryInput(true)}
                            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-white/70 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add new category
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 p-1">
                            <input
                              type="text"
                              autoFocus
                              placeholder="New category name"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleCreateCategory();
                                }
                              }}
                              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/20"
                            />
                            <button
                              type="button"
                              onClick={handleCreateCategory}
                              disabled={isCreatingCategory || !newCategoryName.trim()}
                              className="bg-[#1a1a1a] hover:bg-[#222] border border-white/10 disabled:bg-white/5 disabled:opacity-50 text-white p-1.5 rounded-lg transition-colors flex items-center justify-center min-w-[32px] cursor-pointer"
                            >
                              {isCreatingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <ErrorMsg msg={errors?.category?.message} />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Course Thumbnail *</label>
                {!thumbnailFile ? (
                  <>
                    <input type="file" accept="image/*" id="thumbnail-upload" className="hidden" onChange={handleThumbnailChange} />
                    <label htmlFor="thumbnail-upload" className={`group flex flex-col items-center justify-center w-full h-32 sm:h-40 rounded-xl bg-black border ${errors.thumbnail ? "border-red-500/60" : "border-white/5"} hover:border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-200`}>
                      <MdImage className="text-4xl sm:text-5xl text-white/20 group-hover:text-white/40 transition-colors mb-2 sm:mb-3" />
                      <p className="text-white/40 group-hover:text-white/60 font-medium text-sm sm:text-base">Click to upload thumbnail</p>
                      <p className="text-white/30 text-xs mt-1">PNG, JPG, JPEG up to 500KB</p>
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
                                <div className="bg-gradient-to-r from-rose-500 to-rose-400 h-full transition-all duration-300 ease-out" style={{ width: `${thumbnailProgress}%` }} />
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
              <div className="pb-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
                  <span className="bg-white/5 text-white/70 border border-white/10 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">02</span>
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
                    className="flex items-center gap-2 text-white/70 hover:text-white/90 text-sm font-medium cursor-pointer"
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
                      [scrollbar-color:rgba(255,255,255,0.2)_rgba(255,255,255,0.05)]
                      [&::-webkit-scrollbar]:w-2.5
                      [&::-webkit-scrollbar-track]:bg-white/5
                      [&::-webkit-scrollbar-track]:backdrop-blur-md
                      [&::-webkit-scrollbar-thumb]:bg-white/20
                      [&::-webkit-scrollbar-thumb]:backdrop-blur-lg
                      [&::-webkit-scrollbar-thumb]:border
                      [&::-webkit-scrollbar-thumb]:border-white/5
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:hover:bg-white/30
                    ">

                  <div className="bg-[#111] border border-white/5 rounded-xl p-3 sm:p-5 space-y-3 sm:space-y-4 hover:bg-[#161616] transition-colors my-2">

                    {/* Title */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 font-medium text-xs sm:text-sm">
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
                            className={`group flex items-center gap-2 sm:gap-3 w-full p-3 sm:p-4 rounded-xl bg-black border
                                  ${videoError ? "border-red-500/60" : "border-white/5"}
                                  hover:border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-200`}
                          >
                            <MdVideoLibrary className="text-white/20 group-hover:text-white/40 text-xl sm:text-2xl transition-colors" />

                            <div className="flex-1 text-left">
                              <p className="text-white/40 group-hover:text-white/60 text-xs sm:text-sm font-medium transition-colors">
                                Upload video file
                              </p>
                              <p className="text-white/30 text-xs">
                                MP4, MOV, AVI up to 500MB
                              </p>
                            </div>

                            <MdUpload className="text-white/20 group-hover:text-white/40 text-lg sm:text-xl transition-colors" />
                          </label>
                        </>
                      ) : (
                        <div className="bg-white/5 border border-white/20 rounded-xl p-3 sm:p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div className="bg-rose-500/20 p-1.5 sm:p-2 rounded-lg">
                                <MdVideoLibrary className="text-rose-300 text-lg sm:text-xl" />
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
                                    className="bg-gradient-to-r from-rose-500 to-rose-400 h-full transition-all duration-300"
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
          <div className="p-4 sm:p-8">
            <button type="submit" disabled={isCourseLoading || isVideoLoading} className={`w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:from-rose-800 disabled:to-pink-800 disabled:cursor-not-allowed px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-white font-semibold  transition-all duration-200 hover:scale-[1.02]  flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg ${(isCourseLoading || isVideoLoading) ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
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
