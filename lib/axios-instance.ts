import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

// Function เพื่อสร้าง Axios instance พร้อม config พื้นฐาน
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // === Request Interceptor (ตัวอย่าง) ===
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // สมมติว่าคุณเก็บ Access Token ใน localStorage หรือ state management
      // const token = localStorage.getItem('accessToken');
      // if (token && config.headers) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }

      console.log("Starting Request", config.method?.toUpperCase(), config.url);
      return config;
    },
    (error: AxiosError) => {
      console.error("Request Interceptor Error", error);
      return Promise.reject(error);
    },
  );

  // === Response Interceptor (ตัวอย่าง) ===
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // คุณสามารถแปลง response data ที่นี่ได้ถ้าต้องการ
      // console.log('Response:', response.status, response.data);
      return response; // คืน response ทั้งหมดเพื่อให้ service function จัดการ data เอง
    },
    (error: AxiosError) => {
      console.error(
        "Response Interceptor Error",
        error.response?.status,
        error.message,
      );
      // จัดการ Error แบบ Centralized
      if (error.response?.status === 401) {
        // Redirect to login or refresh token
        console.error("Unauthorized, redirecting to login...");
        // window.location.href = '/login';
      } else if (error.response?.status === 403) {
        console.error("Forbidden access");
      } else if (error.response?.status === 500) {
        console.error("Server error");
      }
      // ควร throw error ต่อไปเพื่อให้ useQuery สามารถจัดการ isError, error state ได้
      return Promise.reject(error);
    },
  );

  return instance;
};

const API_URL = process.env.NEXT_PUBLIC_NESTJS_API_URL!;
export const primaryApiClient = createAxiosInstance(API_URL);
