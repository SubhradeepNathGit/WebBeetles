import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { userRegister } from '../../../redux/slice/authSlice/authSlice';
import getSweetAlert from '../../../util/sweetAlert';
import { MdKeyboardArrowDown } from 'react-icons/md';
import toastifyAlert from '../../../util/toastify';
import hotToast from '../../../util/hot-toast';

const Signup = () => {
  const form = useForm(),
    { register, handleSubmit, formState } = form,
    { errors } = formState,
    dispatch = useDispatch(),
    navigator = useNavigate(),
    [show, setShow] = useState(false),
    [confirmShow, setConfirmShow] = useState(false),
    imgType = ['jpeg', 'jpg', 'png'],
    { isAuthLoading } = useSelector(state => state.userAuth);

  const registerDataHandler = (data) => {

    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('profileImage', data.profile_img[0]);

    if (data.password !== data.cPassword) {
      toastifyAlert.warn("Password and confirm password are not same");
    }

    else if (data.profile_img[0].size / 1024 > 100) {
      toastifyAlert.warn("Profile image size should less than 100KB");
    }

    else if (!imgType.includes(data.profile_img[0].type.split('/')[1])) {
      toastifyAlert.warn("Profile image type should be jpeg / jpg / png");
    }

    else {
      dispatch(userRegister(formData))
        .then(res => {
          // console.log('Response from registration form', res);

          if (res.meta.requestStatus === "fulfilled") {
            hotToast(res.payload.message);
            navigator('/otp', {
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
    <div className="relative min-h-screen flex items-center justify-center px-4 md:px-10">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(44,6,159,0.8), #25004D), url('/auth/signup/2d50b5e330e23a5e512b5bf08a4c93babfc9d528.png')",
          backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: "top"
        }} />

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 items-center gap-6 w-full max-w-8xl">

        {/* Left Section → Signup Form */}
        <div className="w-full flex justify-center order-1">
          <div className="w-full max-w-lg px-8 bg-white/10 backdrop-blur-sm rounded-2xl py-2 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-display text-white text-center mt-4 mb-2">
              Welcome to <Link className="text-blue-400 font-bold" to='/'>WebBeetles</Link>
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit(registerDataHandler)}>
              {/* Name */}
              <label className="block text-sm lg:text-base text-white mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-full px-6 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0 mb-0"
                {...register('name', { required: 'Required*' })}
              />
              <p className="text-xs text-red-400 mb-2 mt-1">{errors.name?.message}</p>

              {/* Email */}
              <label className="block text-sm lg:text-base text-white mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full px-6 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0 mb-0"
                {...register('email', {
                  required: 'Required*',
                  pattern: {
                    value: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-zA-Z.]{2,}$/,
                    message: 'Invalid email'
                  }
                })} />
              <p className="text-xs text-red-400 mb-2 mt-1">{errors.email?.message}</p>

              {/* Profile-image */}
              <label className="block text-sm lg:text-base text-white mb-1">Profile Image</label>
              <input type="file" placeholder="Choose profile image..."
                className="w-full rounded-full px-6 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0 mb-0"
                {...register('profile_img', {
                  required: 'Required*'
                })} accept='image/*' />
              <p className="text-xs text-red-400 mb-2 mt-1">{errors.profile_img?.message}</p>

              {/* Role  */}
              {/* <label className="block text-sm lg:text-base text-white mb-1">Role</label>
              <div className="relative mb-0">
                <select
                  className="w-full appearance-none rounded-full px-6 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0 mb-0 pr-10"
                  {...register("role", {
                    required: "Required*",
                  })}>
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select> */}

              {/* Custom dropdown arrow */}
              {/* <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <MdKeyboardArrowDown />
                </span>
              </div>
              <p className="text-xs text-red-400 mb-2 mt-1">{errors.role?.message}</p> */}


              {/* Password */}
              <label className="block text-sm lg:text-base text-white mb-1">Password</label>
              <div className="relative mb-0">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-full px-6 pr-10 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0"
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
                  className="absolute inset-y-0 right-2 flex items-center mr-2 text-gray-600"
                  onClick={() => setShow(!show)}
                >
                  {show ? <FaRegEyeSlash className='text-[#8200db]' /> : <FaRegEye className='text-[#8200db]' />}
                </button>
              </div>
              <p className="text-xs text-red-400 mb-2 mt-1">{errors.password?.message}</p>

              {/* Confirm Password */}
              <label className="block text-sm lg:text-base text-white mb-1">Confirm Password</label>
              <div className="relative mb-0">
                <input
                  type={confirmShow ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="w-full rounded-full px-6 pr-10 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0"
                  {...register('cPassword')} />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center mr-2 text-gray-600"
                  onClick={() => setConfirmShow(!confirmShow)}
                >
                  {confirmShow ? <FaRegEyeSlash className='text-[#8200db]' /> : <FaRegEye className='text-[#8200db]' />}
                </button>
              </div>

              {/* Submit */}
              <button type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-6 py-3 rounded-full text-base font-semibold">
                {isAuthLoading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="text-center text-white/80 mt-3 text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="text-blue-300 font-bold hover:text-[#b97fff]">
                Log in
              </Link>
            </p>

            {/* <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-400" />
              <span className="mx-2 text-white text-sm">Other options</span>
              <hr className="flex-grow border-gray-400" />
            </div> */}

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

            {/* Terms */}
            <p className="text-gray-200 text-center text-[12px] mt-4 mb-4">
              By continuing, you agree to WebBeetles's{" "}
              <Link to="/terms" className="text-[#87CEEB] hover:text-[#b97fff]">Terms</Link> and{" "}
              <Link to="/privacy" className="text-[#87CEEB] hover:text-[#b97fff]">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        {/* Right Section → Branding */}
        <div className="hidden md:flex flex-col text-white order-2 text-center md:text-left">
          <h1 className="font-display text-4xl lg:text-7xl xl:text-8xl leading-tight mb-4 select-none font-bold">
            WebBeetles
          </h1>
          <p className="max-w-xl font-normal text-base lg:text-lg opacity-90">
            By continuing, you agree to WebBeetles’s Terms and Conditions and
            acknowledge you've read our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
