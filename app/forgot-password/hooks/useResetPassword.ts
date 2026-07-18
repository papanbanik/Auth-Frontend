"use client";

import { useContext } from "react";
import { AppContent } from "@/app/context/AppContent";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type ResetPasswordResponse = {
  success: boolean;
  message: string;
};
type ResetPasswordPayload = {
  email: string;
  newPassword: string;
};
export const useResetPassword = () => {
  const context = useContext(AppContent);
  if (!context) {
    throw new Error("useResetPassword must be used within an AppContent");
  }
  const { backendUrl } = context;
  const resetPassword = async ({
    email,
    newPassword,
  }: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    const { data } = await axios.put<ResetPasswordResponse>(
      `${backendUrl}/reset-password`,
      { newPassword },
      { params: { email }, withCredentials: true },
    );
    return data;
  };
  return useMutation<
    ResetPasswordResponse,
    AxiosError<ResetPasswordResponse>,
    ResetPasswordPayload
  >({
    mutationFn: resetPassword,
  });
};
