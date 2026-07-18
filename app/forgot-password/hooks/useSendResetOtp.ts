import { useContext } from "react";
import { AppContent } from "@/app/context/AppContent";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

type ResetOtpResponse = {
  success: boolean;
  message: string;
};

export const useSendResetOtp = () => {
  const context = useContext(AppContent);
  if (!context) {
    throw new Error("AppContent must be used inside AppContextProvider");
  }

  const { backendUrl } = context;

  const sendResetOtp = async (email: string): Promise<ResetOtpResponse> => {
    if (!backendUrl) {
      throw new Error("Backend URL is not configured");
    }

    const { data } = await axios.post<ResetOtpResponse>(
      `${backendUrl}/send-reset-otp`,
      {},
      { params: { email } },
    );

    return data;
  };

  return useMutation<ResetOtpResponse, AxiosError<unknown>, string>({
    mutationFn: sendResetOtp,
  });
};
