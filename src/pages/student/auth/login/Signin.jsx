import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaFacebook, FaInstagram, FaLinkedinIn, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { loginSlice, updateLastSignInAt } from '../../../../redux/slice/authSlice/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import toastifyAlert from '../../../../util/alert/toastify'
import getSweetAlert from '../../../../util/alert/sweetAlert'
import { Loader2 } from 'lucide-react'
import { logoutUser, setUserAuthData } from '../../../../redux/slice/authSlice/checkUserAuthSlice'
// import Lottie from 'lottie-react'
// import loaderAnimation from '../../../assets/animations/Loading Dots Blue.json';

const Signin = () => {

  const form = useForm(),
    dispatch = useDispatch(),
    navigate = useNavigate(),
    [show, setShow] = useState(false),
    { register, handleSubmit, formState } = form,
    { errors } = formState,
    { isUserAuth, userAuthData } = useSelector(state => state.checkAuth),
    { isUserAuthLoading } = useSelector(state => state.auth),
    user_type = 'student';

  useEffect(() => {
    if (isUserAuth && userAuthData) {
      if (userAuthData.role === user_type) {
        navigate(`/${user_type}/dashboard`, { replace: true });
      } else {
        navigate(`/${userAuthData.role}/dashboard`, { replace: true });
      }
    }
  }, [isUserAuth, userAuthData, navigate, user_type]);

  const loginDataHandler = (data) => {
    // console.log('Login form data', data);

    const login_obj = {
      email: data.email,
      password: data.password
    }

    dispatch(loginSlice({ data: login_obj, role: 'student' }))
      .then(res => {
        // console.log("Response after user login:", res);

        if (res.meta.requestStatus === "fulfilled") {
          if (res?.payload?.userData?.role !== user_type) {
            getSweetAlert('Oops...', "Invalid login credentials", 'error');
            dispatch(logoutUser({ user_type, status: false }));
            return;
          }

          // Clear stale tokens from other roles
          sessionStorage.removeItem('instructor_token');
          sessionStorage.removeItem('admin_token');
          sessionStorage.setItem('student_token', res.payload.session.access_token);
          // Immediately set auth data in Redux to prevent race conditions
          dispatch(setUserAuthData(res.payload.userData));

          dispatch(updateLastSignInAt({ id: res?.payload?.user?.id, user_type }))
            .then(res => {
              if (res.meta.requestStatus === "fulfilled") {
                toastifyAlert.success('Logged In Successfully');
                navigate(`/${user_type}/dashboard`);
              } else {
                getSweetAlert('Oops...', res.payload, 'info');
              }
            })
            .catch(err => {
              console.log('Error occured', err);
              getSweetAlert('Oops...', 'Something went wrong!', 'error');
            });
        }
        else {
          getSweetAlert('Oops...', res.payload?.message || 'Something went wrong!', 'error');
        }
      })
      .catch(err => {
        console.error('Error occured in user login', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-b from-[#7A00FF] via-[#25004D] to-black">
      {/* Left Panel — Branding with Purple Gradient */}
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden items-center justify-center">
        <div className="relative z-10 px-10 lg:px-16 xl:px-20 text-left">
          <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-6 select-none font-bold text-white">
            WebBeetles
          </h1>
          <p className="max-w-md font-normal text-sm lg:text-base xl:text-lg leading-relaxed text-white/80">
            By continuing, you agree to our Terms and Conditions and acknowledge you've read our privacy policy. Transform your learning experience with our comprehensive platform.
          </p>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full md:w-1/2 h-screen bg-transparent flex items-center justify-center relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div aria-hidden="true" className="md:hidden absolute inset-0 bg-gradient-to-br from-purple-950/40 via-transparent to-black" />
        <div aria-hidden="true" className="absolute top-0 right-0 w-72 h-72 bg-purple-600/10 rounded-full filter blur-[100px]" />

        <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl text-white text-center mb-10 font-light tracking-wide">
            Welcome to <Link className="text-blue-400 font-bold" to='/'>WebBeetles</Link>
          </h2>

          <form className="space-y-5 text-white" onSubmit={handleSubmit(loginDataHandler)}>

            {/* email field  */}
            <div>
              <label className="block text-sm lg:text-base mb-2 text-purple-100/80 font-medium">Email</label>
              <input type="email" placeholder="Enter your email" autoComplete='email'
                className="w-full rounded-xl px-5 py-3 text-sm lg:text-base text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                {...register('email', {
                  required: {
                    value: true,
                    message: 'Required*'
                  },
                  pattern: {
                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                    message: 'Invalid email'
                  }
                })} />
              {errors.email && <p className='text-xs text-red-400 mt-1'>{errors.email?.message}</p>}
            </div>

            {/* password field  */}
            <div>
              <label htmlFor="password" className="block text-sm lg:text-base mb-2 text-purple-100/80 font-medium">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} placeholder="Enter your Password" autoComplete="current-password"
                  className="w-full rounded-xl px-5 pr-12 py-3 text-sm lg:text-base text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Required*",
                    }
                  })} />
                <button type="button" className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-400 hover:text-purple-400 transition-colors" onClick={() => setShow(!show)}>
                  {show ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              {errors.password && <p className='text-xs text-red-400 mt-1'>{errors.password?.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forget-password" className="text-sm text-purple-300 hover:text-purple-100 transition-colors">
                Forgot your password?
              </Link>
            </div>

            <button type="submit" disabled={isUserAuthLoading}
              className={`w-full py-3 rounded-xl text-base lg:text-lg font-semibold text-white transition-all duration-300 mt-2
              ${isUserAuthLoading ? "bg-purple-500/50 cursor-not-allowed opacity-70" : "cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg hover:shadow-purple-500/25"}`}>
              {isUserAuthLoading ? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline' /> : ''} {isUserAuthLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <hr className="flex-1 border-t border-white/10" />
            <span className="text-purple-200/50 text-sm font-medium">OR</span>
            <hr className="flex-1 border-t border-white/10" />
          </div>

          <div className="space-y-3">
            <Link to="/signup" className="block w-full text-center border border-purple-500/30 text-purple-200 hover:bg-purple-500/10 py-3 rounded-xl text-base font-semibold transition-all duration-300">
              Create an account
            </Link>
          </div>

          {/* Socials */}
          <div className="flex justify-center gap-5 mt-6">
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

          <p className="text-purple-200/60 text-center text-xs mt-8">
            By continuing, you agree to WebBeetles's{" "}
            <Link to="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">Terms</Link> and{" "}
            <Link to="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signin