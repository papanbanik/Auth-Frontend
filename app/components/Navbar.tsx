"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContent";
import { assets } from "../assets/assets";
import { useRouter } from "next/navigation";
type UserData = {
  email?: string;
  isAccountVerified?: boolean;
  image?: string;
};

type AppContextType = {
  userData: UserData | null;
  backendUrl: string;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
  isLoggedin: boolean;
  logout: () => Promise<void>;
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const context = useContext(AppContent) as AppContextType | undefined;

  if (!context) {
    throw new Error("AppContent must be used inside AppContextProvider");
  }

  const { userData, backendUrl, isLoggedin, logout } = context;

  const emailFirstLetter = userData?.email?.charAt(0)?.toUpperCase() ?? "";

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // ---------------- SEND VERIFY OTP ----------------
  const sendVerifyOtp = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login again");
        router.push("/login");
        return;
      }

      const { data } = await axios.post(
        `${backendUrl}/send-verify-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        router.push("/email-verify");
      } else {
        toast.error(data.message);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Request failed");
      } else {
        toast.error("Request failed");
      }
    }
  };

  return (
    <div className="w-screen flex justify-between items-center px-6 py-4 sm:px-10">
      <Image
        src={assets.logo}
        onClick={() => router.push("/")}
        alt="logo"
        className="w-28 sm:w-32 cursor-pointer"
      />

      {isLoggedin && userData ? (
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="relative w-10 h-10 overflow-hidden rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold uppercase cursor-pointer"
          >
            {userData.image ? (
              <Image
                src={`${backendUrl}/uploads/${userData.image}`}
                alt="image-people"
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            ) : (
              emailFirstLetter
            )}
          </div>
          {open && (
            <div className="absolute right-0 mt-2 bg-white text-black p-3 rounded shadow-md min-w-[180px] z-50">
              {userData.isAccountVerified ? (
                <p className="text-sm font-semibold mb-2 border-b pb-1">
                  Verified
                </p>
              ) : (
                <button
                  onClick={sendVerifyOtp}
                  className="block w-full text-left text-sm hover:text-indigo-500 mb-2 font-semibold"
                >
                  Verify Email
                </button>
              )}
              <button
                onClick={() => router.push("/profile")}
                className="block w-full text-left text-sm hover:text-indigo-500 mb-2 font-semibold "
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700 transition duration-300"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Navbar;
