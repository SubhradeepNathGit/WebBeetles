import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from 'lucide-react';
import { MdArrowOutward, MdCheckCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addQuery } from "../../../redux/slice/contactSlice";
import getSweetAlert from "../../../util/alert/sweetAlert";
import hotToast from "../../../util/alert/hot-toast";
import { checkLoggedInUser } from "../../../redux/slice/authSlice/checkUserAuthSlice";

const ContactForm = () => {

  const [showToast, setShowToast] = useState(false),
    dispatch = useDispatch(),
    { isUserAuth, userAuthData } = useSelector(state => state.checkAuth),
    { isContactLoading, getContactData, isContactError } = useSelector(state => state.query),
    form = useForm(),
    { register, handleSubmit, reset, formState } = form,
    { errors, isSubmitting } = formState;

  useEffect(() => {
    dispatch(checkLoggedInUser())
      .then(res => {
        //  console.log('Response for fetching user profile', res);
      })
      .catch((err) => {
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
        console.log("Error occurred", err);
      });
  }, [dispatch]);

  // console.log('Logged user data', userAuthData);

  const onSubmit = async (data) => {

    const query_obj = {
      name: (isUserAuth && userAuthData?.name) ? userAuthData?.name : data?.name?.split(" ")?.map(name => name?.charAt(0)?.toUpperCase() + name?.slice(1)?.toLowerCase())?.join(" "),
      email: (isUserAuth && userAuthData?.email) ? userAuthData?.email : data?.email?.toLowerCase(),
      subject: data.subject?.charAt(0)?.toUpperCase() + data.subject?.slice(1)?.toLowerCase(),
      message: data.message,
      document_url: null,
      role: "student"
    };

    try {
      dispatch(addQuery(query_obj))
        .then(res => {
          // console.log("Response for adding query in contact", res);

          if (res.meta.requestStatus === "fulfilled") {
            new Promise((r) => setTimeout(r, 1500));
            setShowToast(true);
            reset();

            setTimeout(() => setShowToast(false), 5000);
          }
          else {
            hotToast("Something went wrong!", "error");
          }
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
                disabled={isUserAuth}
                defaultValue={(isUserAuth && userAuthData?.name) ? userAuthData?.name : ""}
                autoComplete="name"
                {...register("name", {
                  required: !isUserAuth ? "Name is required" : false,
                })}
                className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border ${errors.name ? "border-red-500" : "border-white/20"
                  } focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 placeholder:text-white/60 text-white text-sm md:text-base ${isUserAuth ? 'cursor-not-allowed' : ''}`}
              />

              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="w-full sm:w-1/2">
              <input
                type="email"
                placeholder="Your Email"
                disabled={isUserAuth}
                defaultValue={(isUserAuth && userAuthData?.email) ? userAuthData?.email : ""}
                autoComplete="email"
                {...register("email", {
                  required: !isUserAuth ? "Email is required" : false,
                  pattern: {
                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                    message: "Enter a valid email",
                  },
                })}
                className={`w-full p-3 md:p-4 rounded-lg md:rounded-xl bg-white/10 backdrop-blur-md border ${errors.email ? "border-red-500" : "border-white/20"
                  } focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all duration-300 placeholder:text-white/60 text-white text-sm md:text-base ${isUserAuth ? 'cursor-not-allowed' : ''}`}
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
            disabled={isContactLoading}
            className={`bg-white/10 backdrop-blur-md border border-white/30 
              hover:bg-purple-700 hover:border-purple-600 px-6 md:px-8 py-3 md:py-4 
              rounded-full text-white font-semibold text-sm md:text-base shadow-lg 
              hover:shadow-xl disabled:opacity-50 ${isContactLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
              transition-all duration-300 w-full sm:w-auto flex items-center justify-center gap-2`}
          >
            {isContactLoading? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline' /> :<MdArrowOutward className="text-lg" />}
            {isContactLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContactForm;