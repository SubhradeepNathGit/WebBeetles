import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import toastifyAlert from '../../../util/alert/toastify'
import getSweetAlert from '../../../util/alert/sweetAlert'
import { loginSlice, updateLastSignInAt } from '../../../redux/slice/authSlice/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, setUserAuthData } from '../../../redux/slice/authSlice/checkUserAuthSlice'
import { Loader2 } from 'lucide-react'

const AdminSignin = () => {

  const form = useForm(),
    navigate = useNavigate(),
    [show, setShow] = useState(false),
    { register, handleSubmit, formState } = form,
    { errors } = formState,
    dispatch = useDispatch(),
    { isUserAuth, userAuthData } = useSelector(state => state.checkAuth),
    { isUserAuthLoading } = useSelector(state => state.auth),
    user_type = 'admin';

  useEffect(() => {
    const token = sessionStorage.getItem(`${user_type}_token`);
    if (isUserAuth && userAuthData && token) {
      if (userAuthData.role === user_type) {
        navigate(`/admin/dashboard`, { replace: true });
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

    dispatch(loginSlice({ data: login_obj, role: 'admin' }))
      .then(res => {
        // console.log("Response after user login:", res);

        if (res.meta.requestStatus === "fulfilled") {
          if (res?.payload?.userData?.role !== user_type) {
            getSweetAlert('Oops...', "Invalid login credentials", 'error');
            dispatch(logoutUser({ user_type, status: false }));
            return;
          }

          // Clear stale tokens from other roles
          sessionStorage.removeItem('student_token');
          sessionStorage.removeItem('instructor_token');
          sessionStorage.setItem('admin_token', res.payload.session.access_token);
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
    <div className="flex flex-col md:flex-row h-screen w-full bg-gradient-to-b from-emerald-900 to-black">
      {/* Left Panel — Branding with Emerald/Teal Gradient */}
      <div className="hidden md:flex w-1/2 h-screen relative overflow-hidden items-center justify-center">
        <div className="relative z-10 px-10 lg:px-16 xl:px-20 text-left">
          <h1 className="text-5xl lg:text-7xl xl:text-8xl leading-tight mb-6 select-none font-bold text-white">
            WebBeetles
          </h1>
          <p className="max-w-md font-normal text-sm lg:text-base xl:text-lg leading-relaxed text-white/80">
            Secure admin portal for managing the WebBeetles platform. Monitor system status, approve registrations, and control app configuration.
          </p>
        </div>
      </div>

      {/* Right Panel — Admin Login Form */}
      <div className="w-full md:w-1/2 h-screen bg-transparent flex items-center justify-center relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div aria-hidden="true" className="md:hidden absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-black pointer-events-none" />
        <div aria-hidden="true" className="absolute top-0 right-0 w-72 h-72 bg-emerald-600/10 rounded-full filter blur-[100px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md mx-auto px-6 sm:px-10 py-10 lg:py-14">
          {/* Security Badge Container */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure Connection
              </span>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl xl:text-4xl text-white text-center mb-8 font-light tracking-wide">
            Admin Login <Link className="text-emerald-400 font-bold" to='/'>WebBeetles</Link>
          </h2>

          <form className="space-y-5 text-white" onSubmit={handleSubmit(loginDataHandler)}>

            <div>
              <label className="block text-sm lg:text-base mb-2 text-emerald-100/80 font-medium">Email</label>
              <input type="email" placeholder="Enter admin email" autoComplete='email'
                className="w-full rounded-xl px-5 py-3 text-sm lg:text-base text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all mb-2"
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
              {errors.email && <p className='text-xs text-red-400 mt-0 mb-2'>{errors.email?.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm lg:text-base mb-2 text-emerald-100/80 font-medium">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password"
                  className="w-full rounded-xl px-5 pr-12 py-3 text-sm lg:text-base text-white placeholder-gray-500 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Required*",
                    }
                  })} />
                <button type="button" className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-400 hover:text-emerald-400 transition-colors" onClick={() => setShow(!show)}>
                  {show ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
              {errors.password && <p className='text-xs text-red-400 mt-1'>{errors.password?.message}</p>}
            </div>

            <button type="submit" disabled={isUserAuthLoading}
              className={`w-full py-3 rounded-xl text-base lg:text-lg font-semibold text-white transition-all duration-300 mt-6
              ${isUserAuthLoading ? "bg-emerald-500/50 cursor-not-allowed opacity-70" : "cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg hover:shadow-emerald-500/25"}`}>
              {isUserAuthLoading ? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline mr-2' /> : ''} {isUserAuthLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Secure Trust Badges Row */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-around text-center text-white/50 text-[10px] tracking-widest uppercase">
            <div className="flex flex-col items-center gap-1.5 hover:text-emerald-400 transition-colors duration-300">
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>SSL Encryption</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 hover:text-emerald-400 transition-colors duration-300">
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>256-Bit Protection</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 hover:text-emerald-400 transition-colors duration-300">
              <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Audited Logs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSignin
