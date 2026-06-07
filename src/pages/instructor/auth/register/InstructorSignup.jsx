import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import { registerSlice } from '../../../../redux/slice/authSlice/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import getSweetAlert from '../../../../util/alert/sweetAlert';
import toastifyAlert from '../../../../util/alert/toastify';
import hotToast from '../../../../util/alert/hot-toast';
import { Loader2 } from 'lucide-react';

const InstructorSignup = () => {
  const form = useForm({ mode: 'onChange' }),
    { register, handleSubmit, formState, watch } = form,
    { errors } = formState,
    dispatch = useDispatch(),
    navigate = useNavigate(),
    [show, setShow] = useState(false),
    [confirmShow, setConfirmShow] = useState(false),
    [preview, setPreview] = useState(null),
    imgType = ['jpeg', 'jpg', 'png'],
    { isUserAuthLoading } = useSelector(state => state.auth);

  const registerDataHandler = (data) => {
    // console.log('Received data',data);

    const register_obj = {
      name: data?.name?.split(" ")?.map(n => n?.charAt(0)?.toUpperCase() + n?.slice(1)?.toLowerCase())?.join(" "),
      email: data.email,
      password: data.password,
      profile_image: data.profile_img[0],
      is_verified: "pending",
      is_blocked: false
    }

    if (data.password !== data.cPassword) {
      toastifyAlert.warn("Password and confirm password are not same");
    }

    else if (data.profile_img?.[0] && data.profile_img[0].size / 1024 > 100) {
      toastifyAlert.warn("Profile image size should less than 100KB");
    }

    else if (data.profile_img?.[0] && !imgType.includes(data.profile_img[0].type.split('/')[1])) {
      toastifyAlert.warn("Profile image type should be jpeg / jpg / png");
    }

    else {
      dispatch(registerSlice({ data: register_obj, userType: 'instructor' }))
        .then(res => {
          // console.log('Response from registration form', res);

          if (res.meta.requestStatus === "fulfilled") {
            hotToast('Registration successful! Please verify your email via OTP.', "success");
            sessionStorage.setItem('signup_email', data.email);
            navigate('/instructor/otp', {
              state: { email: data.email }
            });
          }
          else {
            getSweetAlert('Oops...', res.payload.message, 'info');
          }
        })
        .catch(err => {
          console.error('Error occured in user registration', err);
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
        });
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-b from-rose-900 to-black">
      {/* Left Panel — Branding with Crimson/Rose Gradient (fixed, non-scrollable) */}
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden items-center justify-center sticky top-0">
        <div className="relative z-10 px-10 lg:px-16 xl:px-20 text-left">
          <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-6 select-none font-bold text-white">
            WebBeetles
          </h1>
          <p className="max-w-md font-normal text-sm lg:text-base xl:text-lg leading-relaxed text-white/80">
            By continuing, you agree to WebBeetles's Terms and Conditions and
            acknowledge you've read our Privacy Policy.
          </p>
        </div>
      </div>

      {/* Right Panel — Signup Form (scrollable) */}
      <div className="w-full md:w-1/2 h-screen bg-transparent overflow-y-auto custom-scrollbar relative">
        {/* Subtle ambient glow */}
        <div aria-hidden="true" className="md:hidden absolute inset-0 bg-gradient-to-br from-rose-950/40 via-transparent to-black pointer-events-none" />
        <div aria-hidden="true" className="absolute top-0 right-0 w-72 h-72 bg-rose-600/10 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14">
          <h2 className="text-2xl lg:text-3xl text-white text-center mb-8 font-light tracking-wide">
            Create Your <span className="font-semibold text-rose-300">Instructor</span> Account on <Link className="text-rose-400 font-bold" to='/instructor/'>WebBeetles</Link>
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit(registerDataHandler)}>
            {/* Name */}
            <div>
              <label className="block text-sm lg:text-base text-rose-100/80 mb-2 font-medium">Name</label>
              <input
                type="text" autoComplete='name'
                placeholder="Enter your name"
                className="w-full rounded-xl px-5 py-3 text-sm text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                {...register('name', { required: 'Required*' })}
              />
              <p className="text-xs text-red-400 mt-1">{errors.name?.message}</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm lg:text-base text-rose-100/80 mb-2 font-medium">Email</label>
              <input
                type="email" autoComplete='email'
                placeholder="Enter your email"
                className="w-full rounded-xl px-5 py-3 text-sm text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                {...register('email', {
                  required: 'Required*',
                  pattern: {
                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                    message: 'Invalid email'
                  }
                })} />
              <p className="text-xs text-red-400 mt-1">{errors.email?.message}</p>
            </div>

            {/* Profile-image */}
            <div>
              <label className="block text-sm lg:text-base text-rose-100/80 mb-2 font-medium">Profile Image</label>
              <div className="flex items-center gap-4">
                <input type="file" placeholder="Choose profile image..."
                  className="flex-grow w-full rounded-xl px-5 py-3 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-500/20 file:text-rose-300 hover:file:bg-rose-500/30"
                  {...register('profile_img', {
                    onChange: (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPreview(URL.createObjectURL(file));
                      } else {
                        setPreview(null);
                      }
                    }
                  })} accept='image/*' />
                {preview && (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-rose-500/30 flex-shrink-0 bg-white/10 flex items-center justify-center">
                    <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-xs text-red-400 mt-1">{errors.profile_img?.message}</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm lg:text-base text-rose-100/80 mb-2 font-medium">Password</label>
              <div className="relative">
                <input autoComplete="new-password"
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl px-5 pr-12 py-3 text-sm text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  {...register('password', {
                    required: 'Required*',
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                      message:
                        'Password must be 8+ characters with uppercase, lowercase, number, and special char'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-400 hover:text-rose-400 transition-colors"
                  onClick={() => setShow(!show)}
                >
                  {show ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              <p className="text-xs text-red-400 mt-1">{errors.password?.message}</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm lg:text-base text-rose-100/80 mb-2 font-medium">Confirm Password</label>
              <input autoComplete="new-password"
                type="password"
                placeholder="Re-enter your password"
                className={`w-full rounded-xl px-5 py-3 text-sm text-white placeholder-gray-500 bg-white/5 border transition-all ${errors.cPassword
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:outline-none'
                    : 'border-white/10 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent'
                  }`}
                {...register('cPassword', {
                  required: 'Required*',
                  validate: (val) => {
                    if (watch('password') !== val) {
                      return "Passwords do not match";
                    }
                  }
                })} />
              {errors.cPassword && <p className="text-xs text-red-400 mt-1">{errors.cPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={isUserAuthLoading}
              className={`w-full py-3 rounded-xl text-base lg:text-lg font-semibold text-white transition-all duration-300 mt-4
              ${isUserAuthLoading ? "bg-rose-500/50 cursor-not-allowed opacity-70" : "cursor-pointer bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg hover:shadow-rose-500/25"}`}>
              {isUserAuthLoading ? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline' /> : ''} {isUserAuthLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center text-rose-200/50 mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/instructor/signin" className="text-rose-300 font-bold hover:text-rose-100 transition-colors">
              Log in
            </Link>
          </p>

          {/* Socials */}
          <div className="flex justify-center gap-5 mt-8">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-blue-400 transition-all border border-white/5">
              <FaFacebook className="text-[20px]" />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-pink-400 transition-all border border-white/5">
              <FaInstagram className="text-[20px]" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-blue-500 transition-all border border-white/5">
              <FaLinkedinIn className="text-[20px]" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/5">
              <FaXTwitter className="text-[20px]" />
            </a>
          </div>

          {/* Terms */}
          <p className="text-rose-200/60 text-center text-xs mt-8 pb-6">
            By continuing, you agree to WebBeetles's{" "}
            <Link to="/terms" className="text-rose-400 hover:text-rose-300 transition-colors">Terms</Link> and{" "}
            <Link to="/privacy" className="text-rose-400 hover:text-rose-300 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructorSignup;
