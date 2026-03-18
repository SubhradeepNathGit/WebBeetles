import axios from "axios"
import baseUrl from "../apiUrl/apiUrl"

const axiosInstance = axios.create({
    baseURL:baseUrl,
    // headers:{}
});

axiosInstance.interceptors.request.use(
    async (con)=>{
        const token = sessionStorage.getItem('user_token');
        if(token){
            con.headers.Authorization = `Bearer ${token}`;
        }
        return con;
    },
    (err)=>{
        return Promise.reject(err);
    }
)

export default axiosInstance;