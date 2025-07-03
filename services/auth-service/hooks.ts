// services/auth-services/hooks.ts (หรือในไฟล์เดียวกับ postRegister)
import { useMutation } from "@tanstack/react-query";
import { postRegister } from "./index"; // นำเข้า postRegister จากไฟล์เดิม
import { PostRegisterBody } from "./types/auth-service-type";

export const useRegister = () => {
  return useMutation({
    mutationFn: (body: PostRegisterBody) => postRegister(body),
    onSuccess: (data) => {
      console.log("Registration successful (React Query):", data);
    },
    onError: (error: Error) => {
      console.error("Registration failed (React Query):", error.message);
    },
  });
};
