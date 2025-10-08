import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { MdArrowOutward, MdCheckCircle, MdAdd, MdDelete, MdUpload } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { allCategory } from "../../../redux/slice/categorySlice";
import { Loader2 } from "lucide-react";
import { createCourse } from "../../../redux/slice/couseSlice";
import getSweetAlert from "../../../util/sweetAlert";

const AddCourseForm = () => {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: "", description: "", price: "", category: "", thumbnail: null, sectionTitle: "",
      lectures: [{ lectureTitle: "", video: null, duration: "" }],
    },
  });

  const dispatch = useDispatch();
  const { isCategoryLoading, getCategoryData, isCategoryError } = useSelector((state) => state.category);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lectures",
  });

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    dispatch(allCategory())
      .then((res) => {
        console.log("Category fetching response", res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);

    if (data.thumbnail?.[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }

    const sections = [
      {
        sectionTitle: data.sectionTitle,
        lectures: data.lectures.map((lec) => ({
          title: lec.lectureTitle,
          videoUrl: lec.video?.[0] ? URL.createObjectURL(lec.video[0]) : "",
          duration: lec.duration,
          isPreview: false,
        })),
      },
    ];

    formData.append("sections", JSON.stringify(sections));

    dispatch(createCourse(formData))
      .then(res => {
        console.log('Response after adding course', res);
        setShowToast(true);
        reset({
          title: "", description: "", price: "", category: "", thumbnail: null, sectionTitle: "", lectures: [{ lectureTitle: "", video: null, duration: "" }]
        }, {
          keepValues: false,
        });

      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  };

  const inputClass = (err) =>
    `w-full p-3 md:p-4 rounded-lg bg-white/10 border ${err ? "border-red-500" : "border-white/20"
    } focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/60 transition-all duration-300`;

  if (isCategoryLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 text-white animate-spin" /></div>;
  return (
    <>
      {showToast && (
        <div className="fixed top-6 left-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 max-w-md -translate-x-1/2">
          <MdCheckCircle className="text-2xl" />
          <p className="text-sm md:text-base font-medium">
            Course uploaded successfully! It's now under review.
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-7xl mx-auto bg-gradient-to-br from-purple-700 to-black/30 border border-purple-500 p-6 md:p-10 rounded-3xl shadow-2xl"
      >
        <h3 className="text-3xl font-semibold mb-4 text-white text-center">
          Upload Course Content
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white mb-2">Course Title *</label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter course title"
                className={inputClass(errors.title)}
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-white mb-2">Description *</label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Describe your course"
                rows={4}
                className={`${inputClass(errors.description)} resize-none`}
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Price & Category */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-white mb-2">Price ($) *</label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Price is required",
                    min: { value: 0, message: "Price must be positive" },
                  })}
                  placeholder="0.00"
                  className={inputClass(errors.price)}
                />
                {errors.price && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="w-full sm:w-1/2">
                <label className="block text-white mb-2">Category *</label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className={inputClass(errors.category)}
                >
                  <option value="">Select category</option>
                  {getCategoryData.map((cat) => (
                    <option key={cat._id} value={cat._id} className="bg-purple-900">
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="block text-white mb-2">Thumbnail *</label>
              <input
                type="file"
                accept="image/*"
                id="thumbnail-upload"
                className="hidden"
                {...register("thumbnail", { required: "Thumbnail is required" })}
              />
              <label
                htmlFor="thumbnail-upload"
                className={`flex items-center justify-center w-full p-4 rounded-lg bg-white/10 border-2 border-dashed ${errors.thumbnail ? "border-red-500" : "border-white/30"
                  } hover:border-white/50 cursor-pointer`}
              >
                <div className="text-center text-white/80">
                  <MdUpload className="text-3xl mx-auto mb-2" />
                  <p>Click to upload thumbnail</p>
                </div>
              </label>
              {errors.thumbnail && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.thumbnail.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Section Title */}
            <div>
              <label className="block text-white mb-2">Section Title *</label>
              <input
                type="text"
                {...register("sectionTitle", {
                  required: "Section title is required",
                })}
                placeholder="e.g., Introduction to React"
                className={inputClass(errors.sectionTitle)}
              />
              {errors.sectionTitle && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.sectionTitle.message}
                </p>
              )}
            </div>

            {/* Lectures */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-purple-200 font-medium">Lectures</h5>
                <button
                  type="button"
                  onClick={() =>
                    append({ lectureTitle: "", video: null, duration: "" })
                  }
                  className="bg-white/10 border border-white/20 hover:bg-white/20 px-3 py-1 rounded-full text-white text-xs flex items-center gap-1"
                >
                  <MdAdd /> Add Lecture
                </button>
              </div>

              {fields.map((lecture, lIdx) => (
                <div
                  key={lecture.id}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3"
                >
                  {/* Lecture Title */}
                  <div>
                    <label className="block text-white/90 text-xs mb-1">
                      Lecture Title *
                    </label>
                    <input
                      type="text"
                      {...register(`lectures.${lIdx}.lectureTitle`, {
                        required: "Lecture title is required",
                      })}
                      placeholder="e.g., Setting up React environment"
                      className={inputClass(
                        errors.lectures?.[lIdx]?.lectureTitle
                      )}
                    />
                    {errors.lectures?.[lIdx]?.lectureTitle && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.lectures[lIdx].lectureTitle.message}
                      </p>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-white/90 text-xs mb-1">
                      Video *
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      id={`video-${lecture.id}`}
                      className="hidden"
                      {...register(`lectures.${lIdx}.video`, {
                        required: "Video is required",
                      })}
                    />
                    <label
                      htmlFor={`video-${lecture.id}`}
                      className={`flex items-center gap-2 w-full p-3 rounded-lg bg-white/10 border ${errors.lectures?.[lIdx]?.video
                        ? "border-red-500"
                        : "border-white/20"
                        } hover:border-white/40 cursor-pointer`}
                    >
                      <MdUpload className="text-white/70 text-lg" />
                      <span className="text-white/80 text-xs truncate">
                        Upload video file
                      </span>
                    </label>
                    {errors.lectures?.[lIdx]?.video && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.lectures[lIdx].video.message}
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-white/90 text-xs mb-1">
                      Duration (in minutes) *
                    </label>
                    <input
                      type="text"
                      {...register(`lectures.${lIdx}.duration`, {
                        required: "Duration is required",
                      })}
                      placeholder="e.g., 15"
                      className={inputClass(
                        errors.lectures?.[lIdx]?.duration
                      )}
                    />
                    {errors.lectures?.[lIdx]?.duration && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.lectures[lIdx].duration.message}
                      </p>
                    )}
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(lIdx)}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 p-2 rounded-lg text-red-300"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white/10 border border-white/30 hover:bg-purple-700 px-6 py-3 rounded-full text-white font-semibold shadow-lg w-full transition-all duration-300"
            >
              <MdArrowOutward className="inline mb-1" />{" "}
              {isSubmitting ? "Uploading..." : "Upload Course"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddCourseForm;