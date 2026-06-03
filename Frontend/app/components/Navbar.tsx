"use client"

import React, { useContext, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import { AppContent } from "../context/AppContent"
import { assets } from "../assets/assets"

type UserData = {
  email?: string
  isAccountVerified?: boolean
}

type AppContextType = {
  userData: UserData | null
  backendUrl: string
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>
  setIsLoggedin: React.Dispatch<React.SetStateAction<boolean>>
  isLoggedin: boolean
}

const Navbar = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const context = useContext(AppContent) as AppContextType | undefined

  if (!context) {
    throw new Error("AppContent must be used inside AppContextProvider")
  }

  const {
    userData,
    backendUrl,
    setUserData,
    setIsLoggedin,
    isLoggedin,
  } = context

  const emailFirstLetter =
    userData?.email?.charAt(0)?.toUpperCase() ?? ""

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    try {
      const token = localStorage.getItem("token")

      await axios.post(
        `${backendUrl}/logout`,
        {},
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      )

      localStorage.removeItem("token")
      setUserData(null)
      setIsLoggedin(false)

      toast.success("Logged out")
      router.push("/login")
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed")
      } else {
        toast.error("Logout failed")
      }
    }
  }

  // ---------------- SEND VERIFY OTP ----------------
  const sendVerifyOtp = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Please login again")
        router.push("/login")
        return
      }

      const { data } = await axios.post(
        `${backendUrl}/send-verify-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (data.success) {
        toast.success(data.message)
        router.push("/email-verify")
      } else {
        toast.error(data.message)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Request failed")
      } else {
        toast.error("Request failed")
      }
    }
  }

  return (
    <div className="w-screen flex justify-between items-center px-6 py-4 sm:px-24">
      <Image src={assets.logo} alt="logo" className="w-28 sm:w-32" />

      {isLoggedin && userData ? (
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold uppercase cursor-pointer"
          >
            {emailFirstLetter}
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
                  className="block w-full text-left text-sm hover:text-indigo-500 mb-2"
                >
                  Verify Email
                </button>
              )}

              <button
                onClick={logout}
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
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      )}
    </div>
  )
}

export default Navbar