import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import toastifyAlert from '../../../util/alert/toastify'
import getSweetAlert from '../../../util/alert/sweetAlert'
import { loginSlice, updateLastSignInAt } from '../../../redux/slice/authSlice/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../../redux/slice/authSlice/checkUserAuthSlice'

const AdminSignin = () => {

  const form = useForm(),
    navigate = useNavigate(),
    [show, setShow] = useState(false),
    { register, handleSubmit, formState } = form,
    { errors } = formState,
    dispatch = useDispatch(),
    { isAuth } = useSelector(state => state.checkAuth),
    { isUserAuthLoading } = useSelector(state => state.auth),
    user_type = 'admin';

  useEffect(() => {

    if (isAuth) {
      navigate("admin/", { replace: true });
    }
  }, [isAuth, navigate]);

  const loginDataHandler = (data) => {
    // console.log('Login form data', data);

    const login_obj = {
      email: data.email,
      password: data.password
    }

    dispatch(loginSlice({ data: login_obj, role: 'admin' }))
      .then(res => {
        // console.log("Response after user login:", res);

        if (res?.payload?.userData?.role !== user_type) {
          getSweetAlert('Oops...', "Invalid login credentials", 'error');
          dispatch(logoutUser({ user_type, status: false }))
          return;
        }

        if (res.meta.requestStatus === "fulfilled") {
          sessionStorage.setItem('admin_token', res.payload.session.access_token);

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
      <div aria-hidden="true" className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            `linear-gradient(rgba(44,6,159,0.8), #25004D), url('/auth/signin/c2f6150a61f3119b499a9fad384211c20ac49766.jpg')`,
          backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top', transform: 'scaleX(-1)'
        }} />
      <div className="container mx-auto px-4 lg:px-6 h-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">

        <div className="hidden md:flex w-full md:w-1/2 flex-col justify-center items-center md:items-start text-white text-center md:text-left">
          <h1 className="font-display text-4xl lg:text-7xl xl:text-8xl leading-tight mb-4 select-none font-bold">
            WebBeetles Admin
          </h1>
          <p className="max-w-[600px] font-normal text-sm lg:text-base xl:text-lg leading-relaxed">
            Secure admin portal for managing the WebBeetles platform.
          </p>
        </div>

        <div className="w-full md:w-1/2 flex justify-center md:justify-end h-full items-center">
          <div className="w-full max-w-[500px] lg:max-w-[500px] bg-white/10 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-2xl my-4">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-display text-white text-center mb-6">
              Admin Login <Link className="text-blue-400 font-bold" to='/'>WebBeetles</Link>
            </h2>

            <form className="space-y-4 lg:space-y-5 text-white" onSubmit={handleSubmit(loginDataHandler)}>

              <label className="block text-sm lg:text-base mb-2">Email</label>
              <input type="email" placeholder="Enter admin email" autoComplete='email'
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
                    {show ? <FaRegEyeSlash className='text-[#8200db] cursor-pointer' /> : <FaRegEye className='text-[#8200db] cursor-pointer' />}
                  </button>
                </div>
                {errors.password && <p className='text-xs text-red-400 mt-1'>{errors.password?.message}</p>}
              </div>

              {/* <Link to="/forget-password" className="block text-center text-sm lg:text-base text-white hover:text-[#87CEEB] transition-colors">
                Forgot your password?
              </Link> */}

              <button type="submit" disabled={isUserAuthLoading}
                className={`w-full py-2 lg:py-3 rounded-full text-base lg:text-lg font-semibold text-white transition-colors
                ${isUserAuthLoading ? "bg-[#7fc4fb] cursor-not-allowed opacity-70" : "cursor-pointer bg-[#2696f5] hover:bg-[#1679c1]"}`}>
                {isUserAuthLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* <div className="flex items-center gap-4 my-4">
              <hr className="flex-1 border-t border-white/30" />
              <span className="text-white/80 text-sm lg:text-base">OR</span>
              <hr className="flex-1 border-t border-white/30" />
            </div>

            <div className="space-y-3">
              <Link to="/signup" className="block w-full text-center border-2 border-[#b97fff] text-[#b97fff] hover:bg-[#b97fff] hover:text-white py-2 lg:py-3 rounded-full text-base lg:text-lg font-semibold transition-all">
                Register
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSignin
