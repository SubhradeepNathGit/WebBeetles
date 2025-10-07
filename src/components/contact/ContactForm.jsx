import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdArrowOutward, MdCheckCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userProfile } from "../../redux/slice/userSlice";
import { addQuery } from "../../redux/slice/contactSlice";
import getSweetAlert from "../../util/sweetAlert";

const ContactForm = () => {
  const [showToast, setShowToast] = useState(false),
    dispatch = useDispatch(),
    navigate = useNavigate(),
    { isAuth } = useSelector(state => state.checkAuth),
    { isUserLoading, getUserData, isUserError } = useSelector(state => state.user),
    { isContactLoading, getContactData, isContactError } = useSelector(state => state.query),
    form = useForm(),
    { register, handleSubmit, reset, formState } = form,
    { errors, isSubmitting } = formState;

  useEffect(() => {
    if (isAuth) {
      dispatch(userProfile())
        .then(res => {
          console.log('Response for fetching user profile', res);
        })
        .catch((err) => {
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
          console.log("Error occurred", err);
        });
    }
  }, [isAuth, dispatch]);

  // console.log('Logged user data', getUserData);

  const onSubmit = async (data) => {
    if (!isAuth) {
      navigate("/signin");
      return;
    }

    const query_obj = {
      subject: data.subject,
      message: data.message,
    };

    try {
      dispatch(addQuery(query_obj))
        .then(res => {
          // console.log("Response for adding query in contact", res);

          new Promise((r) => setTimeout(r, 1500));
          setShowToast(true);
          reset();

          setTimeout(() => setShowToast(false), 5000);
        })
    }
    catch (err) {
      console.error("Error occurred in submitting query", err);
      getSweetAlert("Oops...", "Something went wrong!", "error");
    }
  }

  return (
    <>
      {showToast && (
        <div className="fixed top-6 left-1/2 z-50 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-3 max-w-md -translate-x-1/2 transition-opacity duration-300">
          <MdCheckCircle className="text-2xl flex-shrink-0" />
          <p className="text-sm md:text-base font-medium">
            Message sent successfully! We'll get back to you soon.
          </p>
        </div>
      )}

      <div className="bg-gradient-to-br from-purple-700 to-black/30 border border-purple-500 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl transition-all duration-500 w-full">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 md:mb-4 text-white text-center">
          Send Us Message
        </h3>
        <p className="text-purple-100 mb-6 md:mb-8 text-sm md:text-base text-center">
          Let us know how we can help by filling out the form below.
        </p>

        <form
          className="space-y-4 md:space-y-5"
          id="contact-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-1/2">
              <input
                type="text"
                placeholder="Your Name"
                disabled={isAuth}
                defaultValue={isAuth && getUserData?.user ? getUserData.user.name : ""}
                autoComplete="name"
                {...register("name", {
                  required: !isAuth ? "Name is required" : false,
                })}
                className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border ${errors.name ? "border-red-500" : "border-white/20"
                  } focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 placeholder:text-white/60 text-white text-sm md:text-base`}
              />

              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="w-full sm:w-1/2">
              <input
                type="email"
                placeholder="Your Email"
                disabled={isAuth}
                defaultValue={isAuth && getUserData?.user ? getUserData.user.email : ""}
                autoComplete="email"
                {...register("email", {
                  required: !isAuth ? "Email is required" : false,
                  pattern: {
                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                    message: "Enter a valid email",
                  },
                })}
                className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border ${errors.email ? "border-red-500" : "border-white/20"
                  } focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 placeholder:text-white/60 text-white text-sm md:text-base`}
              />

              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            <input
              type="text"
              placeholder="Your Subject"
              {...register("subject", { required: "Subject is required" })}
              className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border ${errors.subject ? "border-red-500" : "border-white/20"
                } focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 placeholder:text-white/60 text-white text-sm md:text-base`}
            />
            {errors.subject && (
              <p className="text-red-400 text-xs mt-1">
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <textarea
              rows={5}
              placeholder="Your Message"
              {...register("message", {
                required: "Message is required",
                maxLength: {
                  value: 150,
                  message: "Message should under 150 characters"
                }
              })}
              className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border ${errors.message ? "border-red-500" : "border-white/20"
                } focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 resize-none placeholder:text-white/60 text-white text-sm md:text-base`}
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white/10 backdrop-blur-md border border-white/30 
              hover:bg-purple-700 hover:border-purple-600 px-6 md:px-8 py-3 md:py-4 
              rounded-full text-white font-semibold text-sm md:text-base shadow-lg 
              hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <MdArrowOutward className="text-lg" />
            {isContactLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactForm;