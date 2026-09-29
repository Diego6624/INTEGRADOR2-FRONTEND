import axios from "axios";

const url = import.meta.env.VITE_API_URL || ''

const apiFetch = axios.create({
    baseURL: url,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

apiFetch.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401 && window.location.href !== '/login') {
            window.location.href = '/login'
        }

        return Promise.reject(error)


    }

)

export default apiFetch;