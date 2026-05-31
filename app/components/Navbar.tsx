"use client"

import React, { useContext, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import { AppContent } from "../context/AppContent"
import { assets } from "../assets/assets"

const Navbar = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const { userData, backendUrl, setUserData } = useContext(AppContent)

  const emailFirstLetter =
    userData?.email?.charAt(0)?.toUpperCase()

  const logout = async () => {
    try {
      await axios.post(
        `${backendUrl}/logout`,
        {},
        { withCredentials: true }
      )

      setUserData(null)
      toast.success("Logged out")
      router.push("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const sendVerifyOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/send-verify-otp`,
        {},
        { withCredentials: true }
      )

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className="w-screen flex justify-between items-center px-6 py-4 sm:px-24">
      <Image src={assets.logo} alt="logo" className="w-28 sm:w-32" />

      {userData ? (
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
                className="block cursor-pointer w-full text-left text-sm text-red-500 hover:text-red-700"
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