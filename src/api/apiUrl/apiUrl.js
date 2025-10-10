const baseUrl = 'http://localhost:3005/';

// auth 
const endPoint_userRegister = 'api/auth/register';
const endPoint_userLogin = 'api/auth/login';
const endPoint_userVerifyEmail = 'api/auth/verify-email';
const endPoint_userProfile = 'api/auth/user-profile'; //user fetch
const endPoint_userUpdateProfile = 'api/auth/update-profile'; //user update
const endPoint_userForgotPassword = 'api/auth/forgot-password';
const endPoint_userResetPassword = 'api/auth/reset-password';
const endPoint_userResendOTP = 'api/auth/resend-otp';

// category 
const endPoint_createCategory = 'api/categories/create-category';
const endPoint_allCategory = 'api/categories/all-categories';
const endPoint_categoryDetails = 'api/categories/details';
const endPoint_updateCategory = 'api/categories/update-category';
const endPoint_deleteCategory = 'api/categories/delete-category';

// instructor 
const endPoint_requestInstructor = 'api/instructor/request';
const endPoint_requestInstructorStatus = 'api/instructor/my-status';
const endPoint_allInstructor = 'api/instructor/all-instructors';
const endPoint_editInstructorProfile = 'api/instructor/edit-profile';
const endPoint_sepeficInstructor = 'api/instructor'; 

// course
const endPoint_allCourse = 'api/courses/all-courses';
const endPoint_sepeficCourse = 'api/courses/details';
const endPoint_addCourse = 'api/courses/create-course';
const endPoint_updateCourse = 'api/courses/update-course';
const endPoint_deleteCourse = 'api/courses/delete-course';
const endPoint_courseRating = 'api/courses';
const endPoint_categoryWiseCourse = 'api/categories/courses';

// payment 
const endPoint_payment_create = 'api/payments/purchase';
const endPoint_payment_verify = 'api/payments/verify';

//contact
const endPoint_contact = 'api/contact/user-contact'

export default baseUrl;

export {
    endPoint_userRegister, endPoint_userLogin, endPoint_userVerifyEmail, endPoint_userProfile, endPoint_userUpdateProfile, endPoint_userForgotPassword, endPoint_userResetPassword, endPoint_userResendOTP,
    endPoint_createCategory, endPoint_allCategory, endPoint_categoryDetails, endPoint_updateCategory, endPoint_deleteCategory,
    endPoint_requestInstructor, endPoint_requestInstructorStatus, endPoint_allInstructor, endPoint_editInstructorProfile,endPoint_sepeficInstructor,
    endPoint_allCourse, endPoint_sepeficCourse, endPoint_addCourse, endPoint_updateCourse, endPoint_deleteCourse, endPoint_courseRating, endPoint_categoryWiseCourse,
    endPoint_payment_create,endPoint_payment_verify,
    endPoint_contact
};