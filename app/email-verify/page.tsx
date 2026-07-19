"use client";

import { useState, useRef, useContext, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AppContent } from "../context/AppContent";
import Navbar from "../components/Navbar";
// import { type } from "./../../node_modules/next/dist/esm/server/lib/router-utils/typegen";

type AppContextType = {
  backendUrl: string;
};

const Page = () => {
  const router = useRouter();
  const context = useContext(AppContent);
  const [timer, setTimer] = useState(60);
  if (!context) {
    throw new Error("AppContent must be used inside AppContextProvider");
  }
  useEffect(() => {
    if (timer <= 0) return;
    const time = setTimeout(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(time);
  }, [timer]);
  const { backendUrl } = context as AppContextType;

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return toast.error("Enter 6 digit OTP");
    }

    try {
      const res = await axios.post(
        `${backendUrl}/verify-account`,
        { otp: finalOtp },
        { headers: getAuthHeader() }, // ✅
      );

      if (res.data.success) {
        toast.success(res.data.message || "Email verified successfully");
        router.push("/");
      } else {
        toast.error(res.data.message || "Verification failed");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };
  const handleResendOTP = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/send-verify-otp`,
        {},
        { headers: getAuthHeader() },
      );
      if (res.data.success) {
        toast.success("OTP sent sucessfully");
        setTimer(60);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center ">
        <div className="w-96 bg-slate-900 p-10 rounded-lg">
          <h2 className="text-white text-center text-2xl font-semibold mb-2">
            Email Verify OTP
          </h2>
          <p className="text-center text-sm text-indigo-300 mb-6">
            Enter the 6 digit code sent to your email
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2 mb-6">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center text-white text-xl bg-[#333A5C] rounded-md outline-none"
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-full"
            >
              Verify OTP
            </button>
            <button
              type="button"
              disabled={timer > 0}
              onClick={handleResendOTP}
              className="text-gray-200 mt-5 px-22 cursor-pointer disable:opacity-50 disabled:cursor-not-allowed"
            >
              {timer > 0 ? `ReSend OTP in ${timer}` : "Resend OTP"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Page;
