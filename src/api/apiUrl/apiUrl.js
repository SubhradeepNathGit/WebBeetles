const baseUrl = 'http://localhost:5000/';

const endPoint_userRegister = 'api/user/auth/register';
const endPoint_userLogin = 'api/user/auth/login';
const endPoint_userVerify = 'api/user/auth/verify';
const endPoint_userProfile = 'api/user/auth/profile';
const endPoint_userForgotPassword = '/api/user/auth/forgot-password';
const endPoint_userResetPassword = 'api/user/auth/reset-password';
const endPoint_userUpdatePassword = 'api/user/auth/update-password';

export default baseUrl;
export { endPoint_userRegister, endPoint_userLogin, endPoint_userVerify, endPoint_userProfile, endPoint_userForgotPassword, endPoint_userResetPassword, endPoint_userUpdatePassword };