import axios, {type AxiosError} from 'axios'
import type {ErrorResponseDTO} from "@/api/types/ErrorResponseDTO.ts";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponseDTO>) => {
    if (error.response) {
      const { status, data } = error.response;
      console.log("From api interceptor")
      console.log("error status: ", status, "error detail: ", data.detail, "error title: ", data.title)
    }
    return Promise.reject(error);
  }
)

export default api
