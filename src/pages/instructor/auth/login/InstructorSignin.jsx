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
import { logoutUser } from '../../../../redux/slice/authSlice/checkUserAuthSlice'
// import Lottie from 'lottie-react'
// import loaderAnimation from '../../../assets/animations/Loading Dots Blue.json';

const InstructorSignin = () => {

  const form = useForm(),
    { register, handleSubmit, formState } = form,
    { errors } = formState,
    dispatch = useDispatch(),
    navigate = useNavigate(),
    [show, setShow] = useState(false),
    { isAuth } = useSelector(state => state.checkAuth),
    { isUserAuthLoading } = useSelector(state => state.auth),
    user_type = 'instructor';

  useEffect(() => {

    if (isAuth) {
      navigate("/instructor/", { replace: true });
    }
  }, [isAuth, navigate]);

  const loginDataHandler = (data) => {
    // console.log('Login form data', data);

    const login_obj = {
      email: data.email,
      password: data.password
    }

    dispatch(loginSlice({ data: login_obj, role: 'instructor' }))
      .then(res => {
        // console.log("Response after user login:", res);

        if (res?.payload?.userData?.role !== user_type) {
          getSweetAlert('Oops...', "Invalid login credentials", 'error');
          dispatch(logoutUser({ user_type, status: false }))
          return;
        }

        const instructorData = res?.payload?.userData;

        if (res.meta.requestStatus === "fulfilled") {

          sessionStorage.setItem('instructor_token', res.payload.session.access_token);

          if (instructorData?.application_status == 'pending' && !instructorData?.application_complete) {
            navigate(`/instructor/profile-form`, { state: { instructorData } });
          }
          else if (instructorData?.application_status != 'approved' && instructorData?.application_complete) {
            navigate(`/instructor/request-status`, { state: { instructorData } });
          }
          else if (instructorData?.application_status == 'approved' && instructorData?.last_login == null) {
            navigate(`/instructor/request-status`, { state: { instructorData } });
          }
          else {
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
        }
        else {
          // getSweetAlert('Oops...', 'Something went wrong!', 'error');
          getSweetAlert('Oops...', res.payload.message, 'error');
        }
      })
      .catch(err => {
        console.error('Error occured in user login', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      })
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background layer that replaces .background::after */}
      <div aria-hidden="true" className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            `linear-gradient(#ea5645,#ec0505), url('/auth/signin/c2f6150a61f3119b499a9fad384211c20ac49766.jpg')`,
          backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top', transform: 'scaleX(-1)'
        }} />
      <div className="container mx-auto px-4 lg:px-6 h-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center md:items-start text-white text-center md:text-left">
          <h1 className="font-display text-4xl lg:text-7xl xl:text-8xl leading-tight mb-4 select-none font-bold">
            WebBeetles
          </h1>
          <p className="max-w-[600px] font-normal text-sm lg:text-base xl:text-lg leading-relaxed">
            By continuing, you agree to our Terms and Conditions and acknowledge you've read our privacy policy. Transform your learning experience with our comprehensive platform.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end h-full items-center">
          <div className="w-full max-w-[500px] lg:max-w-[500px] bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl my-4">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-display text-white text-center mb-6">
              Welcome to <Link className="text-red-900 font-bold" to='/instructor/'>WebBeetles</Link>
            </h2>

            <form className="space-y-4 lg:space-y-5 text-white" onSubmit={handleSubmit(loginDataHandler)}>

              {/* email field  */}
              <label className="block text-sm lg:text-base mb-2">Email</label>
              <input type="email" placeholder="Enter your email" autoComplete='email'
                className="w-full rounded-full px-6 py-2 lg:py-3 text-sm lg:text-base placeholder-gray-500 text-gray-800 outline-0 bg-white mb-2"
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

              {/* password field  */}
              <div>
                <label htmlFor="password" className="block text-sm lg:text-base mb-2 text-white">Password</label>
                <div className="relative">
                  <input type={show ? "text" : "password"} placeholder="Enter your Password" autoComplete="current-password"
                    className="w-full rounded-full px-6 pr-12 py-2 lg:py-3 text-sm lg:text-base placeholder-gray-500 text-gray-800 outline-0 bg-white"
                    {...register("password", {
                      required: {
                        value: true,
                        message: "Required*",
                      }
                    })} />
                  <button type="button" className="absolute inset-y-0 right-4 flex items-center text-lg text-gray-600 hover:text-[rgba(44,6,159,0.8)]" onClick={() => setShow(!show)}>
                    {show ? <FaRegEyeSlash className='text-[#ec0505] cursor-pointer' /> : <FaRegEye className='text-[#ec0505] cursor-pointer' />}
                  </button>
                </div>
                {errors.password && <p className='text-xs text-red-400 mt-1'>{errors.password?.message}</p>}
              </div>

              <Link to="/forget-password" className="block text-center text-sm lg:text-base text-white hover:text-[#87CEEB] transition-colors">
                Forgot your password?
              </Link>

              <button type="submit" disabled={isUserAuthLoading}
                className={`w-full py-2 lg:py-3 rounded-full text-base lg:text-lg font-semibold text-white transition-colors
                ${isUserAuthLoading ? "bg-[#7fc4fb] cursor-not-allowed opacity-70" : "cursor-pointer bg-[#f70202] hover:bg-[#f74747] hover:border-2 hover:border-white"}`}>
                {isUserAuthLoading ? <Loader2 className='text-white animate-spin m-0 p-0 w-4 h-4 inline' /> : ''} {isUserAuthLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-4">
              <hr className="flex-1 border-t border-white/30" />
              <span className="text-white/80 text-sm lg:text-base">OR</span>
              <hr className="flex-1 border-t border-white/30" />
            </div>

            <div className="space-y-3">
              <Link to="/instructor/signup" className="block w-full text-center border-2 border-[#fff] text-[#fff] hover:bg-[#f74747] hover:text-white py-2 lg:py-3 rounded-full text-base lg:text-lg font-semibold transition-all">
                Register
              </Link>
            </div>

            {/* Socials */}
            <div className="flex justify-center gap-4 mt-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                className="hover:scale-110 transition-transform">
                <FaFacebook className="text-[#1877F2] text-[28px]" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                className="hover:scale-110 transition-transform">
                <FaInstagram className="text-[28px]" style={{
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"
                className="hover:scale-110 transition-transform">
                <FaLinkedinIn className="text-[#0A66C2] text-[28px]" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"
                className="hover:scale-110 transition-transform">
                <FaXTwitter className="text-white text-[28px]" />
              </a>
            </div>

            <p className="text-gray-200 text-center text-xs lg:text-sm font-medium mt-4">
              By continuing, you agree to WebBeetles's{" "}
              <Link to="/terms" className="text-[#87CEEB] hover:text-[#b97fff] transition-colors">Terms and Conditions</Link> and{" "}
              <Link to="/privacy" className="text-[#87CEEB] hover:text-[#b97fff] transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorSignin