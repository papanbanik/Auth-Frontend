"use client";

import { useContext } from "react";
import { AppContent } from "@/app/context/AppContent";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type VerifyOtpResponse = {
  success: boolean;
  message: string;
};

type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export const useVerifyOtp = () => {
  const context = useContext(AppContent);

  if (!context) {
    throw new Error("useVerifyOtp must be used within an AppContentProvider");
  }

  const { backendUrl } = context;

  const verifyOtp = async ({
    email,
    otp,
  }: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
    const { data } = await axios.post<VerifyOtpResponse>(
      `${backendUrl}/verify-reset-otp`,
      { otp },
      { params: { email }, withCredentials: true },
    );

    return data;
  };

  return useMutation<
    VerifyOtpResponse,
    AxiosError<VerifyOtpResponse>,
    VerifyOtpPayload
  >({
    mutationFn: verifyOtp,
  });
};
