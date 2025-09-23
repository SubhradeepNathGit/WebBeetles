import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaFacebook, FaInstagram, FaLinkedinIn, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { userRegister } from '../../../redux/slice/authSlice/authSlice';
import getSweetAlert from '../../../util/sweetAlert';
import { MdKeyboardArrowDown } from 'react-icons/md';

const Signup = () => {
  const form = useForm(),
    { register, handleSubmit, formState } = form,
    { errors } = formState,
    dispatch = useDispatch(),
    navigator = useNavigate(),
    [show, setShow] = useState(false);

  const registerDataHandler = (data) => {
    const register_obj = {
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password
    };

    dispatch(userRegister(register_obj))
      .then(res => {
        console.log('Response from form', res);

        if (res.payload) {
          getSweetAlert(
            'Congrates',
            'Registration Completed Successfully <br> Please verify your email before logging in',
            'success'
          );
          navigator('/user-signin');
        } else {
          getSweetAlert('Oops...', 'Something went wrong!', 'error');
        }
      })
      .catch(err => {
        console.error('Error occured in user registration', err);
        getSweetAlert('Oops...', 'Something went wrong!', 'error');
      });
  };

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
          <div className="w-full max-w-md bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-display text-white text-center mb-4">
              Welcome to <Link className="text-blue-400" to='/'>WebBeetles</Link>
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
                })}
              />
              <p className="text-xs text-red-400 mb-2 mt-1">{errors.email?.message}</p>

              {/* Role  */}
              <label className="block text-sm lg:text-base text-white mb-1">Role</label>
              <div className="relative mb-0">
                <select
                  className="w-full appearance-none rounded-full px-6 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0 mb-0 pr-10"
                  {...register("role", {
                    required: "Required*",
                  })}
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>

                {/* Custom dropdown arrow */}
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                  <MdKeyboardArrowDown />
                </span>
              </div>
              <p className="text-xs text-red-400 mb-2 mt-1">{errors.role?.message}</p>


              {/* Password */}
              <label className="block text-sm lg:text-base text-white mb-1">Password</label>
              <div className="relative mb-0">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Enter your Password"
                  className="w-full rounded-full px-6 pr-10 py-2 lg:py-3 text-sm text-gray-800 bg-white outline-0"
                  {...register('password', {
                    required: 'Required*',
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                      message:
                        'Password must be 8+ chars with uppercase, lowercase, number, and special char'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={() => setShow(!show)}
                >
                  {show ? <FaRegEyeSlash className='text-[#8200db]' /> : <FaRegEye className='text-[#8200db]' />}
                </button>
              </div>
              <p className="text-xs text-red-400 mb-2 mt-1">{errors.password?.message}</p>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-base font-semibold mt-2"
              >
                Continue
              </button>
            </form>

            <p className="text-center text-white/80 mt-3 text-sm">
              Already have an account?{" "}
              <Link to="/user-signin" className="text-blue-300 font-bold hover:text-[#b97fff]">
                Log in
              </Link>
            </p>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-400" />
              <span className="mx-2 text-white text-sm">Other options</span>
              <hr className="flex-grow border-gray-400" />
            </div>

            {/* Socials */}
            <div className="flex justify-center gap-4 mt-4">
              <Link to=""><FaFacebook className="text-[#87CEEB] hover:text-[#b97fff] text-[20px]" /></Link>
              <Link to=""><FaInstagram className="text-[#87CEEB] hover:text-[#b97fff] text-[20px]" /></Link>
              <Link to=""><FaLinkedinIn className="text-[#87CEEB] hover:text-[#b97fff] text-[20px]" /></Link>
              <Link to=""><FaXTwitter className="text-[#87CEEB] hover:text-[#b97fff] text-[20px]" /></Link>
            </div>

            {/* Terms */}
            <p className="text-gray-200 text-center text-[12px] mt-4">
              By continuing, you agree to WebBeetles's{" "}
              <Link to="" className="text-[#87CEEB] hover:text-[#b97fff]">Terms</Link> and{" "}
              <Link to="" className="text-[#87CEEB] hover:text-[#b97fff]">Privacy Policy</Link>.
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
