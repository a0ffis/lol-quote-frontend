// services/auth-services/index.ts (ปรับปรุงการจัดการ error)
import { primaryApiClient } from "@/lib/axios-instance";
import { PostRegisterBody } from "./types/auth-service-type";
import axios, { AxiosError } from "axios"; // นำเข้า AxiosError

export const postRegister = async (body: PostRegisterBody): Promise<any> => {
  const { email, password, username } = body;
  try {
    const response = await primaryApiClient.post("/auth/register", {
      username: username,
      email: email,
      password: password,
    });

    // ถ้า NestJS Controller ใช้ @HttpCode(HttpStatus.CREATED)
    // การเรียกนี้จะมาถึงตรงนี้และ response.status จะเป็น 201
    // ดังนั้นโค้ดด้านล่างนี้อาจจะไม่จำเป็นถ้า NestJS ส่ง 201 ตลอดเมื่อสำเร็จ
    if (response.status !== 201) {
      // สำหรับกรณีที่ server ส่ง status อื่นที่ไม่ใช่ 201 แต่ยังไม่ใช่ error (unlikely with a good backend)
      throw new Error(
        response.data?.message ||
          `Registration failed with status code: ${response.status}`,
      );
    }

    console.log("Registration successful:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      const errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        axiosError.message;
      console.error(`Error during registration:`, errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error(
        `An unexpected error occurred during registration:`,
        (error as Error).message,
      );
      throw new Error(
        (error as Error).message ||
          "An unexpected error occurred during registration.",
      );
    }
  }
};
