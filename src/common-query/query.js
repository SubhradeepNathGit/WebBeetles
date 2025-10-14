import { endPoint_fetchUserProfile, endPoint_sepeficCourse } from "../api/apiUrl/apiUrl";
import axiosInstance from "../api/axiosInstance/axiosInstance";

// show course-details
export const fetchCourseDetails = async (id) => {
    return axiosInstance.get(`${endPoint_sepeficCourse}/${id}`);
}

// show specific-user-details
export const fetchUserDetails = async (id) => {
    return axiosInstance.get(`${endPoint_fetchUserProfile}/${id}`);
}