import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER,
    timeout: 10000,
})

export { axiosInstance as axios }
