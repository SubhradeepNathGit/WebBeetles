import React, { useState } from "react";
import { MdArrowOutward, MdCheckCircle, MdAdd, MdDelete, MdUpload } from "react-icons/md";

const AddCourse = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    thumbnail: null,
    sectionTitle: "",
    lectures: [
      { id: Date.now(), lectureTitle: "", video: null, duration: "" },
    ],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Design",
    "Business",
    "Marketing",
    "Photography",
    "Music",
  ];

  const validateForm = () => {
    let newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || parseFloat(formData.price) < 0)
      newErrors.price = "Enter a valid price";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.thumbnail) newErrors.thumbnail = "Thumbnail is required";
    if (!formData.sectionTitle.trim()) newErrors.sectionTitle = "Section title is required";

    formData.lectures.forEach((lecture, idx) => {
      if (!lecture.lectureTitle.trim())
        newErrors[`lecture_${idx}_title`] = "Lecture title is required";
      if (!lecture.video)
        newErrors[`lecture_${idx}_video`] = "Video is required";
      if (!lecture.duration.trim())
        newErrors[`lecture_${idx}_duration`] = "Duration is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        thumbnail: null,
        sectionTitle: "",
        lectures: [{ id: Date.now(), lectureTitle: "", video: null, duration: "" }],
      });
      setErrors({});
      setTimeout(() => setShowToast(false), 4000);
    }, 1500);
  };

  const updateLecture = (lId, field, value) =>
    setFormData((p) => ({
      ...p,
      lectures: p.lectures.map((l) =>
        l.id === lId ? { ...l, [field]: value } : l
      ),
    }));

  const addLecture = () =>
    setFormData((p) => ({
      ...p,
      lectures: [
        ...p.lectures,
        { id: Date.now(), lectureTitle: "", video: null, duration: "" },
      ],
    }));

  const removeLecture = (lId) =>
    setFormData((p) => ({
      ...p,
      lectures: p.lectures.filter((l) => l.id !== lId),
    }));

  const inputClass = (err) =>
    `w-full p-3 md:p-4 rounded-lg bg-white/10 border ${
      err ? "border-red-500" : "border-white/20"
    } focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 text-white placeholder:text-white/60 transition-all duration-300`;

  return (
    <>
      {/* ✅ Success Toast */}
      {showToast && (
        <div className="fixed top-6 left-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 max-w-md -translate-x-1/2">
          <MdCheckCircle className="text-2xl" />
          <p className="text-sm md:text-base font-medium">
            Course uploaded successfully! It's now under review.
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto bg-gradient-to-br from-purple-700 to-black/30 border border-purple-500 p-6 md:p-10 rounded-3xl shadow-2xl">
        <h3 className="text-3xl font-semibold mb-4 text-white text-center">
          Upload Course Content
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Course Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                placeholder="Enter course title"
                className={inputClass(errors.title)}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-white mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe your course"
                rows={4}
                className={`${inputClass(errors.description)} resize-none`}
              />
              {errors.description && (
                <p className="text-red-400 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-white mb-2">Price ($) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                  placeholder="0.00"
                  className={inputClass(errors.price)}
                />
                {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
              </div>

              <div className="w-full sm:w-1/2">
                <label className="block text-white mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  className={inputClass(errors.category)}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-purple-900">
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-400 text-xs mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Thumbnail *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((p) => ({ ...p, thumbnail: e.target.files[0] }))
                }
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className={`flex items-center justify-center w-full p-4 rounded-lg bg-white/10 border-2 border-dashed ${
                  errors.thumbnail ? "border-red-500" : "border-white/30"
                } hover:border-white/50 cursor-pointer`}
              >
                <div className="text-center text-white/80">
                  <MdUpload className="text-3xl mx-auto mb-2" />
                  <p>{formData.thumbnail ? formData.thumbnail.name : "Click to upload thumbnail"}</p>
                </div>
              </label>
              {errors.thumbnail && (
                <p className="text-red-400 text-xs mt-1">{errors.thumbnail}</p>
              )}
            </div>
          </div>

          {/* ✅ Right Column — Single Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Section Title *</label>
              <input
                type="text"
                value={formData.sectionTitle}
                onChange={(e) => setFormData((p) => ({ ...p, sectionTitle: e.target.value }))}
                placeholder="e.g., Introduction to React"
                className={inputClass(errors.sectionTitle)}
              />
              {errors.sectionTitle && (
                <p className="text-red-400 text-xs mt-1">{errors.sectionTitle}</p>
              )}
            </div>

            {/* Lectures */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h5 className="text-purple-200 font-medium">Lectures</h5>
                <button
                  onClick={addLecture}
                  className="bg-white/10 border border-white/20 hover:bg-white/20 px-3 py-1 rounded-full text-white text-xs flex items-center gap-1"
                >
                  <MdAdd /> Add Lecture
                </button>
              </div>

              {formData.lectures.map((lecture, lIdx) => (
                <div key={lecture.id} className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-3">
                  {/* Lecture Title */}
                  <div>
                    <label className="block text-white/90 text-xs mb-1">Lecture Title *</label>
                    <input
                      type="text"
                      value={lecture.lectureTitle}
                      onChange={(e) =>
                        updateLecture(lecture.id, "lectureTitle", e.target.value)
                      }
                      placeholder="e.g., Setting up React environment"
                      className={inputClass(errors[`lecture_${lIdx}_title`])}
                    />
                    {errors[`lecture_${lIdx}_title`] && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors[`lecture_${lIdx}_title`]}
                      </p>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="block text-white/90 text-xs mb-1">Video *</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) =>
                        updateLecture(lecture.id, "video", e.target.files[0])
                      }
                      className="hidden"
                      id={`video-${lecture.id}`}
                    />
                    <label
                      htmlFor={`video-${lecture.id}`}
                      className={`flex items-center gap-2 w-full p-3 rounded-lg bg-white/10 border ${
                        errors[`lecture_${lIdx}_video`]
                          ? "border-red-500"
                          : "border-white/20"
                      } hover:border-white/40 cursor-pointer`}
                    >
                      <MdUpload className="text-white/70 text-lg" />
                      <span className="text-white/80 text-xs truncate">
                        {lecture.video ? lecture.video.name : "Choose video file"}
                      </span>
                    </label>
                    {errors[`lecture_${lIdx}_video`] && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors[`lecture_${lIdx}_video`]}
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
                      value={lecture.duration}
                      onChange={(e) =>
                        updateLecture(lecture.id, "duration", e.target.value)
                      }
                      placeholder="e.g., 15"
                      className={inputClass(errors[`lecture_${lIdx}_duration`])}
                    />
                    {errors[`lecture_${lIdx}_duration`] && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors[`lecture_${lIdx}_duration`]}
                      </p>
                    )}
                  </div>

                  {formData.lectures.length > 1 && (
                    <button
                      onClick={() => removeLecture(lecture.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 p-2 rounded-lg text-red-300"
                    >
                      <MdDelete className="text-lg" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-white/10 border border-white/30 hover:bg-purple-700 px-6 py-3 rounded-full text-white font-semibold shadow-lg w-full transition-all duration-300"
            >
              <MdArrowOutward className="inline mb-1" />{" "}
              {isSubmitting ? "Uploading..." : "Upload Course"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCourse;